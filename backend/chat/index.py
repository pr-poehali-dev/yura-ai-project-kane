"""
Обработчик чата с ИИ-ассистентом Кейн через OpenAI API.
Принимает историю сообщений, возвращает ответ ассистента.
"""
import os
import json
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    if event.get("httpMethod") != "POST":
        return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Invalid JSON"})}

    messages = body.get("messages", [])
    assistant_name = body.get("assistantName", "Кейн")

    if not messages:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "No messages provided"})}

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"reply": "⚠️ API-ключ OpenAI не настроен. Добавьте OPENAI_API_KEY в секреты проекта на platform.openai.com/api-keys"}),
        }

    system_prompt = (
        f"Ты — ИИ-ассистент по имени {assistant_name}. "
        "Ты умный, дружелюбный и помогаешь пользователю с любыми задачами. "
        "Отвечай на том же языке, на котором пишет пользователь. "
        "Будь конкретным и полезным. Не используй лишних вступлений."
    )

    openai_messages = [{"role": "system", "content": system_prompt}]
    for msg in messages:
        role = "user" if msg.get("role") == "user" else "assistant"
        openai_messages.append({"role": role, "content": msg.get("text", "")})

    payload = json.dumps({
        "model": "gpt-4o-mini",
        "messages": openai_messages,
        "max_tokens": 1000,
        "temperature": 0.7,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read().decode("utf-8"))
        reply = result["choices"][0]["message"]["content"].strip()
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        print(f"OpenAI HTTP error {e.code}: {err_body}")
        if e.code == 401:
            reply = "⚠️ Неверный API-ключ OpenAI. Проверьте значение OPENAI_API_KEY в настройках проекта."
        elif e.code == 429:
            reply = "⚠️ Превышен лимит запросов к OpenAI. Попробуйте через несколько секунд."
        else:
            reply = f"⚠️ Ошибка OpenAI ({e.code}). Попробуйте позже."
    except Exception as e:
        print(f"Unexpected error: {e}")
        reply = "⚠️ Произошла ошибка при обращении к ИИ. Попробуйте ещё раз."

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"reply": reply}),
    }

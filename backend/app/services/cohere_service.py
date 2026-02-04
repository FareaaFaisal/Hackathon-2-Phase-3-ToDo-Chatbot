import os
import cohere
import traceback
from typing import List, Dict, Optional


class CohereService:
    def __init__(self):
        api_key = os.getenv("COHERE_API_KEY")
        if not api_key:
            raise RuntimeError("COHERE_API_KEY is missing")

        self.co = cohere.Client(api_key)

    def generate_response(
        self,
        prompt: str,
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        try:
            response = self.co.chat(
                model="command-r7b-12-2024",  # ✅ FREE + LIVE
                message=prompt,
                chat_history=chat_history or [],
                temperature=0.3,
                max_tokens=400,
            )

            return response.text

        except Exception:
            print("❌ COHERE ERROR:")
            traceback.print_exc()
            return (
                "I'm having trouble responding right now. "
                "Please try again in a moment."
            )

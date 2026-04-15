from openai import OpenAI
import psycopg2
from dotenv import load_dotenv 
import json
import os


load_dotenv()

client = OpenAI(api_key=os.getenv("AI_API_KEY"))

conn = psycopg2.connect(os.getenv("route_to_db"))

def fetch_benefits(category): 
  cur = conn.cursor() 
  
  cur.execute(""" SELECT slug, name, category, urls, details FROM benefits WHERE category = %s AND active = true """, (category,)) 
  
  rows = cur.fetchall() 
 
  benefits = [] 
  for r in rows: benefits.append({ "slug": r[0],
                                   "name": r[1],
                                     "category": r[2],
                                       "urls": r[3], 
                                       "details": r[4] }) 
  return benefits

def benefit_answer(user_input, category):
    benefits_data = fetch_benefits(category)

    structured_data = []

    for benefit in benefits_data:
        structured_data.append({ "slug": benefit["slug"], 
                                "name": benefit["name"],
                                "category": benefit["category"], 
                                "urls": benefit["urls"], 
                                "details": benefit["details"]})
    
    prompt = f"""
    You are a helpful and friendly assistant helping users understand UK government benefits.
    - Match the user's situation to relevant benefits 
    - Explain eligibility clearly
    - List required documents 
    - Explain how to apply 
    - Include warnings about common pitfalls or mistakes to avoid when applying.

    DO NOT make up anything.

    Return ONLY valid JSON in this format:

  {
    "matched_benefits": [
      {
        "name": "",
        "eligibility": "",
        "documents": [],
        "how_to_apply": "",
        "warnings": []
      }
    ]
  }
    Use simple, clear language.

    User situation:
    {user_input}
    
    Available benefits data:
    {json.dumps(structured_data, indent=2)}
    """

    response = client.responses.create(
        model='gpt-4.1-mini',
        input=prompt,
        response_format={"type": "json_object"}
    )

    return response.output_text

user_input = input('Describe your situation: ')
category = input('Which benefits are you interested in, tax or income?: ')
category = category.lower().strip()

print(benefit_answer(user_input, category))
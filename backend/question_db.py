from typing import List, Dict, Set
import re

# Database of interview questions mapped to specific keywords/skills
QUESTION_BANK = {
    "react": [
        {
            "question": "How does React's Virtual DOM work, and what are the main benefits of using it?",
            "why_asked": "To test your understanding of React's performance optimization model and rendering cycle.",
            "general_tip": "Explain the reconciliation process, state changes, and batch updating. Mention key/ref props if relevant."
        },
        {
            "question": "Can you explain the differences between React Hooks (like useEffect, useMemo, and useCallback) and how you avoid infinite re-renders?",
            "why_asked": "To evaluate your hands-on mastery of state management and memory/performance optimizations in functional components.",
            "general_tip": "Explain dependencies arrays, the cleanup function in useEffect, and when to use memoization vs when it's overkill."
        }
    ],
    "python": [
        {
            "question": "What is the difference between lists and generators in Python? When and why would you use a generator?",
            "why_asked": "To gauge your understanding of Python's memory management, lazy evaluation, and handling of large datasets.",
            "general_tip": "Discuss the 'yield' keyword, how generators evaluate elements on-the-fly, and the space complexity advantages (O(1) memory) for streaming files or large databases."
        },
        {
            "question": "How does Python handle memory management and garbage collection? Can you explain reference counting and cyclic references?",
            "why_asked": "To check your deep knowledge of Python internals, especially useful when working on high-performance backends.",
            "general_tip": "Explain that Python uses reference counting primarily, and a generational garbage collector to detect and clean up cyclic references."
        }
    ],
    "fastapi": [
        {
            "question": "Why is FastAPI considered faster than Django/Flask, and how does it utilize Python's async/await keywords?",
            "why_asked": "To evaluate your understanding of asynchronous programming in Python and modern API framework architectures.",
            "general_tip": "Mention ASGI servers (like Uvicorn), event loops, non-blocking I/O, and how it performs type validation automatically using Pydantic."
        }
    ],
    "aws": [
        {
            "question": "How do you secure data at rest and in transit in an AWS environment? Which services would you use?",
            "why_asked": "To assess your knowledge of cloud security best practices and compliance.",
            "general_tip": "Discuss AWS KMS (Key Management Service) for data at rest, HTTPS/TLS certificates via ACM (AWS Certificate Manager) for data in transit, and IAM roles for least privilege access."
        }
    ],
    "docker": [
        {
            "question": "What is multi-stage builds in Docker, and why are they considered a best practice for production images?",
            "why_asked": "To check your understanding of container security, image optimization, and DevOps practices.",
            "general_tip": "Explain how multi-stage builds separate the build environment from the final runtime environment, resulting in significantly smaller and more secure images."
        }
    ],
    "kubernetes": [
        {
            "question": "Can you explain the difference between a Pod, a Deployment, and a Service in Kubernetes? How do they interact?",
            "why_asked": "To check your knowledge of container orchestration, networking, and microservice scaling.",
            "general_tip": "Define a Pod as the smallest deployable unit, a Deployment for managing replica sets/updates, and a Service for exposing pods to network traffic."
        }
    ],
    "sql": [
        {
            "question": "What are database indexes? How do they speed up queries, and what are the trade-offs of having too many indexes?",
            "why_asked": "To evaluate your database query optimization and performance tuning skills.",
            "general_tip": "Explain indexes as lookup tables (usually B-Trees). Note that while SELECT queries speed up, INSERT, UPDATE, and DELETE queries slow down due to index maintenance."
        }
    ],
    "nosql": [
        {
            "question": "When would you choose a NoSQL database (like MongoDB or Redis) over a relational database (like PostgreSQL)?",
            "why_asked": "To assess your architectural decision-making skills and schema design trade-offs.",
            "general_tip": "Discuss horizontal scaling, schema flexibility, performance for key-value lookups vs. the need for strong consistency, complex joins, and ACID compliance in SQL."
        }
    ],
    "agile": [
        {
            "question": "How do you deal with shifting priorities or scope changes mid-sprint? Walk us through a real-world scenario.",
            "why_asked": "To evaluate your adaptability, communication, and alignment with Agile/Scrum team dynamics.",
            "general_tip": "Emphasize collaboration with the Product Owner, analyzing the impact of changes on the sprint goal, and negotiating trade-offs rather than just rejecting or blindly accepting work."
        }
    ],
    "devops": [
        {
            "question": "Can you describe a robust CI/CD pipeline you have set up? What safety checks (linting, tests, security scans) did you include?",
            "why_asked": "To check your automation mindset and engineering quality standards.",
            "general_tip": "Describe a pipeline from push to deploy. Include static code analysis, unit testing, integration tests, containerization, and blue-green or rolling deployment strategies."
        }
    ],
    "system design": [
        {
            "question": "How would you design a system to handle a sudden surge in traffic (e.g., a flash sale or viral event)?",
            "why_asked": "To evaluate your scalability, system architecture, and system bottleneck analysis skills.",
            "general_tip": "Discuss rate limiting, load balancers, caching layers (Redis/CDN), horizontal autoscaling, message queues (Kafka/RabbitMQ) for asynchronous processing, and database read replicas."
        }
    ]
}

BEHAVIORAL_QUESTIONS = [
    {
        "question": "Tell me about a time you had a technical disagreement with a team member. How did you resolve it?",
        "why_asked": "To evaluate conflict resolution, teamwork, and objectivity in technical decision-making.",
        "general_tip": "Use the STAR method (Situation, Task, Action, Result). Focus on data-driven arguments, active listening, compromises, and supporting the final decision even if it wasn't your original choice."
    },
    {
        "question": "Describe a major bug or production incident you caused or encountered. How did you diagnose and resolve it, and what did you learn?",
        "why_asked": "To assess your problem-solving under pressure, debugging methodology, and ability to learn from mistakes.",
        "general_tip": "Be honest and take ownership. Explain your troubleshooting process (logs, metrics, rollbacks), the fix, and the post-mortem action items (adding monitoring, tests) to prevent it from happening again."
    }
]

def generate_interview_questions(resume_text: str, jd_keywords: dict) -> List[Dict]:
    """
    Generate interview questions based on the job description keywords and candidate's resume.
    Inject customized hints and tips by analyzing whether the skill exists in the resume.
    """
    resume_lower = resume_text.lower()
    
    # Identify matching and missing keywords
    technical_skills = jd_keywords.get("technical", [])
    methodologies = jd_keywords.get("methodologies_soft", [])
    all_keywords = technical_skills + methodologies
    
    selected_questions = []
    seen_questions = set()
    
    # 1. Gather technical/methodology questions based on JD keywords
    for keyword in all_keywords:
        keyword_clean = keyword.lower().strip()
        # Find matching questions in the bank
        matching_keys = [k for k in QUESTION_BANK.keys() if k in keyword_clean or keyword_clean in k]
        
        for key in matching_keys:
            for q_data in QUESTION_BANK[key]:
                q_text = q_data["question"]
                if q_text in seen_questions:
                    continue
                seen_questions.add(q_text)
                
                # Analyze resume to see if candidate mentions this skill
                has_skill_in_resume = key in resume_lower or any(word in resume_lower for word in key.split() if len(word) > 2)
                
                # Scan resume for company/project context to personalize the tip
                custom_tip = ""
                if has_skill_in_resume:
                    # Look for sentences containing the keyword to reference
                    sentences = re.split(r'\.|\n', resume_text)
                    relevant_context = []
                    for sentence in sentences:
                        if key in sentence.lower():
                            cleaned_sent = sentence.strip()
                            if len(cleaned_sent) > 15 and len(cleaned_sent) < 150:
                                relevant_context.append(cleaned_sent)
                                if len(relevant_context) >= 2:
                                    break
                    
                    if relevant_context:
                        custom_tip = f"**Custom Resume Match**: Your resume mentions: *\"{relevant_context[0]}\"*. Be ready to reference this specific experience as your main talking point."
                    else:
                        custom_tip = f"**Custom Resume Match**: You listed '{key}' on your resume. Be ready to explain how you applied it in your projects."
                else:
                    custom_tip = f"**Resume Gap Warning**: '{key.upper()}' is listed in the JD but not found on your resume. Be prepared to explain how your experience with related tools (or your quick learning ability) enables you to adapt."
                
                selected_questions.append({
                    "category": key.title(),
                    "question": q_text,
                    "why_asked": q_data["why_asked"],
                    "general_tip": q_data["general_tip"],
                    "custom_tip": custom_tip,
                    "resume_gap": not has_skill_in_resume
                })
                
    # 2. Add some standard behavioral questions
    for q_data in BEHAVIORAL_QUESTIONS:
        selected_questions.append({
            "category": "Behavioral",
            "question": q_data["question"],
            "why_asked": q_data["why_asked"],
            "general_tip": q_data["general_tip"],
            "custom_tip": "Focus on a recent project or role from your resume, structuring your answer with the STAR format (Situation, Task, Action, Result).",
            "resume_gap": False
        })
        
    return selected_questions

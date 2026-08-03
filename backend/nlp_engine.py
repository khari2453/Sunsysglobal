import re
import io
import spacy
from pypdf import PdfReader
from typing import Dict, List, Set, Tuple

# Try to load spaCy model, fallback to English blank model if not installed yet
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = spacy.blank("en")

# A comprehensive list of common technical skills, tools, and methodologies to ensure high-accuracy extraction
SKILL_DICTIONARY = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "ruby", "php", "go", "golang", "rust", "swift", "kotlin", "sql", "nosql", "html", "css", "sass", "bash", "shell", "r", "scala", "matlab",
    # Frontend Frameworks & Libraries
    "react", "react.js", "reactjs", "angular", "angularjs", "vue", "vue.js", "vuejs", "next.js", "nextjs", "nuxt", "svelte", "jquery", "bootstrap", "tailwind", "tailwindcss", "redux", "graphql", "apollo",
    # Backend & Web Frameworks
    "node", "node.js", "nodejs", "express", "expressjs", "django", "flask", "fastapi", "spring", "spring boot", "laravel", "asp.net", "nest.js", "nestjs", "rails", "ruby on rails",
    # Databases & Caching
    "postgresql", "postgres", "mysql", "mongodb", "sqlite", "redis", "elasticsearch", "cassandra", "mariadb", "dynamodb", "firebase", "supabase", "oracle", "mssql",
    # Cloud, DevOps & Virtualization
    "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins", "git", "github", "gitlab", "ci/cd", "cicd", "nginx", "apache", "linux", "unix",
    # Data Science, AI & ML
    "machine learning", "deep learning", "nlp", "natural language processing", "ai", "artificial intelligence", "data science", "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn", "pandas", "numpy", "opencv", "tableau", "powerbi", "spark", "hadoop",
    # Methodologies, Design & Soft Skills
    "agile", "scrum", "kanban", "devops", "system design", "microservices", "rest api", "restful api", "apis", "oop", "object-oriented", "tdd", "test driven development", "ui/ux", "figma", "gitflow", "project management", "communication", "leadership", "mentoring", "problem solving", "critical thinking"
}

# Words to ignore (false positives that might be labeled as proper nouns/noun chunks but aren't skills)
IGNORE_WORDS = {
    "experience", "years", "candidate", "team", "role", "work", "job", "description", "ability", "skills", "knowledge", "company", "business", "requirements", "responsibilities", "application", "environment", "project", "projects", "support", "development", "developer", "engineer", "designer", "manager", "lead", "member", "understanding", "success", "standards", "practices", "processes", "tools", "systems", "solutions", "client", "clients", "customer", "customers", "user", "users", "product", "products", "services", "technologies", "technology", "opportunity", "opportunities", "growth", "career", "benefits"
}

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text from PDF file bytes."""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def clean_text(text: str) -> str:
    """Normalize text by converting to lowercase and stripping punctuation/whitespace."""
    text = text.lower()
    text = re.sub(r'[^\w\s\-\.\+#]', ' ', text)  # Keep chars like C++, C#, .NET
    return " ".join(text.split())

def extract_keywords_from_jd(jd_text: str) -> Dict[str, List[str]]:
    """
    Parse Job Description using spaCy to extract:
    - Hard skills/technologies
    - Soft skills/methodologies
    Returns dictionary with categorized lists of keywords.
    """
    doc = nlp(jd_text)
    
    technical_keywords = set()
    methodology_keywords = set()
    
    # 1. Match against our predefined skill dictionary (lemmatized and string searches)
    cleaned_jd = clean_text(jd_text)
    for skill in SKILL_DICTIONARY:
        # Match using word boundaries to avoid matching "go" inside "good"
        pattern = r'\b' + re.escape(skill) + r'\b'
        # Handle special cases like C++, C#, .Net, React.js
        if '+' in skill or '#' in skill or '.' in skill:
            pattern = re.escape(skill)
            
        if re.search(pattern, cleaned_jd):
            # Classify key terms
            if skill in {"agile", "scrum", "kanban", "devops", "project management", "system design", "microservices", "communication", "leadership", "mentoring", "problem solving", "critical thinking", "ui/ux", "tdd"}:
                methodology_keywords.add(skill)
            else:
                technical_keywords.add(skill)
                
    # 2. Extract using NLP (Entities and Noun Chunks) to catch custom or novel keywords
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.lower().strip()
        # Clean up punctuation
        chunk_text = re.sub(r'[^\w\s\-\.\+#]', '', chunk_text)
        
        # Split chunks into subwords if they contain 'and' or commas
        subparts = [p.strip() for p in re.split(r'\band\b|,', chunk_text) if p.strip()]
        for part in subparts:
            if part in IGNORE_WORDS or len(part) < 2:
                continue
            
            # If it's a known skill, it was already handled. Otherwise, run heuristic:
            # If the part is 1-3 words, contains a proper noun/noun, and isn't a common word, we capture it.
            part_doc = nlp(part)
            is_valid_candidate = False
            for token in part_doc:
                if token.pos_ in {"PROPN", "NOUN"} and token.text.lower() not in IGNORE_WORDS:
                    is_valid_candidate = True
                    break
            
            if is_valid_candidate and len(part.split()) <= 3:
                # Add to methodology or tech based on simple heuristic
                if any(w in part for w in ["management", "method", "process", "culture", "design", "skills", "thinking"]):
                    methodology_keywords.add(part)
                else:
                    technical_keywords.add(part)

    # Convert sets to sorted lists
    return {
        "technical": sorted(list(technical_keywords)),
        "methodologies_soft": sorted(list(methodology_keywords))
    }

def evaluate_resume_match(resume_text: str, jd_keywords: Dict[str, List[str]]) -> Dict:
    """
    Compare the resume text with extracted JD keywords.
    Determine which keywords are matched, partially matched, or missing.
    Calculate match score and list suggestions.
    """
    cleaned_resume = clean_text(resume_text)
    resume_doc = nlp(cleaned_resume)
    
    # Extract lemmas of the resume to do smart matching
    resume_lemmas = {token.lemma_.lower() for token in resume_doc}
    
    matched = []
    partial = []
    missing = []
    
    all_jd_keywords = jd_keywords["technical"] + jd_keywords["methodologies_soft"]
    
    for keyword in all_jd_keywords:
        cleaned_kw = clean_text(keyword)
        # 1. Try exact phrase match
        pattern = r'\b' + re.escape(cleaned_kw) + r'\b'
        if '+' in cleaned_kw or '#' in cleaned_kw or '.' in cleaned_kw:
            pattern = re.escape(cleaned_kw)
            
        if re.search(pattern, cleaned_resume):
            matched.append(keyword)
            continue
            
        # 2. Try lemma match for each token in the keyword
        kw_doc = nlp(cleaned_kw)
        kw_lemmas = [token.lemma_.lower() for token in kw_doc]
        
        # If all lemmas of keyword tokens are in the resume, it's a match
        if all(lemma in resume_lemmas for lemma in kw_lemmas if lemma not in IGNORE_WORDS):
            matched.append(keyword)
            continue
            
        # 3. Partial Match: Check if any word of the keyword is in the resume
        # (e.g. JD requires "React.js developer", resume has "React")
        is_partial = False
        for word in cleaned_kw.split():
            if len(word) > 2 and word not in IGNORE_WORDS:
                word_pattern = r'\b' + re.escape(word) + r'\b'
                if re.search(word_pattern, cleaned_resume) or word in resume_lemmas:
                    is_partial = True
                    break
        
        if is_partial:
            partial.append(keyword)
        else:
            missing.append(keyword)
            
    # Calculate match score
    total_keywords = len(all_jd_keywords)
    if total_keywords > 0:
        score = (len(matched) + 0.5 * len(partial)) / total_keywords * 100
        score = min(100.0, round(score, 1))
    else:
        score = 0.0
        
    # Generate suggestions
    suggestions = []
    for kw in missing:
        # Classify and give specific tips
        if kw in SKILL_DICTIONARY:
            suggestions.append({
                "keyword": kw,
                "type": "Technical" if kw not in {"agile", "scrum", "kanban", "devops", "project management", "system design"} else "Methodology",
                "message": f"Add '{kw}' to your resume. Describe a project or experience where you used this tool/skill, or list it in your Skills section."
            })
        else:
            suggestions.append({
                "keyword": kw,
                "type": "Contextual",
                "message": f"The job description mentions '{kw}'. Integrate this keyword or a related concept to match the job phrasing."
            })
            
    for kw in partial:
        suggestions.append({
            "keyword": kw,
            "type": "Refinement",
            "message": f"You have a partial match for '{kw}'. Make sure to align your phrasing exactly (e.g., update to '{kw}') to pass ATS filters."
        })

    return {
        "score": score,
        "matched": matched,
        "partial": partial,
        "missing": missing,
        "suggestions": suggestions
    }

def generate_tailored_resume_preview(resume_text: str, missing_keywords: List[str]) -> str:
    """
    Generate a simple text mockup showing how the resume could be tailored
    by appending a tailored Skills Addendum or highlighting where modifications are suggested.
    """
    # Create a nice layout formatting the suggestions
    tailored_text = resume_text
    
    if missing_keywords:
        addendum = "\n\n" + "="*40 + "\n"
        addendum += "ATS OPTIMIZED ADDENDUM (RECOMMENDED ADDITIONS)\n"
        addendum += "="*40 + "\n"
        addendum += "The following high-priority skills were identified in the Job Description but missing from your profile.\n"
        addendum += "We recommend incorporating these into your 'Skills' section or Project descriptions:\n\n"
        for kw in missing_keywords:
            addendum += f" - [ ] {kw.title()} \n"
        
        tailored_text += addendum
        
    return tailored_text

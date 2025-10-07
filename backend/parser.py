class ResumeParser:
    """Simple resume parser placeholder"""
    
    def __init__(self):
        self.name = "ResumeParser"
    
    def parse(self, file_path):
        """Parse resume file and return basic info"""
        return {
            "name": "Sample Name",
            "email": "sample@email.com",
            "phone": "123-456-7890",
            "skills": ["Python", "JavaScript", "React"],
            "experience": "2 years"
        }
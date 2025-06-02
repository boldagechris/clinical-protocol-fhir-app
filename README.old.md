Clinical Protocol to FHIR Converter 🏥
An AI-powered React application that converts clinical study protocols into validated FHIR resources and deploys them to Medplum.

Show Image

✨ Features
🧠 AI Protocol Generation: Generate comprehensive clinical protocols using AI
📄 Multi-Format Support: Upload Word, PDF, LaTeX, or text files
⚡ FHIR Conversion: Convert protocols to standardized FHIR resources
🛡️ Validation: Real-time FHIR validation with detailed feedback
🚀 Medplum Integration: Deploy validated resources to Medplum
🎨 Modern UI: Beautiful, responsive interface with animations
🚀 Quick Start
Prerequisites
Node.js 16+ and npm
Modern web browser
Installation
bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/clinical-protocol-fhir-app.git
cd clinical-protocol-fhir-app

# Install dependencies
npm install

# Start development server
npm start
The app will open at http://localhost:3000

🔧 Usage
1. Generate or Upload Protocol
AI Generation: Describe your clinical study and let AI create a comprehensive protocol
File Upload: Upload existing protocols in Word, PDF, or LaTeX format
2. Process and Convert
Text extraction and preprocessing
Conversion to FHIR resources via Danish Text-to-FHIR API
3. Validation
Real-time FHIR validation
Detailed error, warning, and information reports
Resource count and compliance checking
4. Deploy
Deploy validated FHIR resources to Medplum
Integration ready for production healthcare systems
📊 FHIR Resources Generated
The app automatically generates appropriate FHIR resources including:

Patient - Study participants
Practitioner - Investigators and coordinators
Organization - Institutions and sponsors
ResearchStudy - Study metadata and protocols
MedicationRequest - Prescribed treatments
CarePlan - Treatment and follow-up plans
Procedure - Study procedures and assessments
Condition - Medical conditions and diagnoses
🛠️ Technical Stack
Frontend: React 18, Tailwind CSS, Lucide React
File Processing: Mammoth (Word docs), PDF parsing ready
FHIR: Integration with Danish Text-to-FHIR API
Validation: FHIR resource validation engine
Deployment: Medplum integration
AI: Ready for OpenAI/Claude integration
🔌 API Integration
Danish Text-to-FHIR API
javascript
const response = await fetch('https://your-api-endpoint.app.github.dev/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: clinicalProtocolText,
    language: 'da'
  })
});
Medplum Deployment
javascript
import { MedplumClient } from '@medplum/core';

const medplum = new MedplumClient({
  baseUrl: 'https://api.medplum.com/',
  clientId: 'your-client-id'
});

await medplum.createResource(fhirBundle);
🚀 Deployment
Vercel (Recommended)
bash
npm run build
# Deploy to Vercel via GitHub integration
Netlify
bash
npm run build
# Deploy build folder to Netlify
GitHub Pages
bash
npm install --save-dev gh-pages
npm run build
npm run deploy
🧪 Testing
bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# E2E testing (if configured)
npm run e2e
📝 Example Prompts for AI Generation
"A randomized trial for diabetes management in elderly patients"
"Cardiovascular prevention study with new statin therapy"
"Pediatric asthma treatment protocol using inhaled corticosteroids"
"Mental health intervention study for depression treatment"
🤝 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🏥 Healthcare Compliance
This application is designed for research and development purposes. For production healthcare use:

Ensure HIPAA compliance for patient data
Implement proper authentication and authorization
Follow local healthcare data regulations
Validate with clinical teams before deployment
🔗 Related Projects
Danish Text-to-FHIR API
Medplum
HAPI FHIR
📞 Support
📧 Email: your.email@example.com
🐛 Issues: GitHub Issues
💬 Discussions: GitHub Discussions
⭐ Star this repository if it helped you!


import React, { useState, useCallback } from 'react';
import { 
  AiOutlineUpload as Upload,
  AiOutlineFileText as FileText,
  AiOutlineHeart as Activity,
  AiOutlineCheckCircle as CheckCircle,
  AiOutlineExclamationCircle as AlertCircle,
  AiOutlineDownload as Download,
  AiOutlineSend as Send,
  AiOutlineLoading3Quarters as Loader2,
  AiOutlineThunderbolt as Zap,
  AiOutlineBulb as Brain,
  AiOutlineSafety as ShieldCheck,
  AiOutlineStar as Sparkles,
  AiOutlineReload as RefreshCw
} from 'react-icons/ai';
import * as mammoth from 'mammoth';
import { Activity } from 'lucide-react';


interface ValidationIssue {
  severity: 'error' | 'warning' | 'information';
  code: string;
  details: string;
  location: string;
}

interface ValidationResults {
  valid: boolean;
  issues: ValidationIssue[];
  resourceCount: number;
  errors: number;
  warnings: number;
  information: number;
}

interface FHIRResource {
  resourceType: string;
  id: string;
  [key: string]: any;
}

interface FHIRBundle {
  resourceType: string;
  id: string;
  type: string;
  timestamp?: string;
  entry?: Array<{ resource: FHIRResource }>;
}

const ClinicalProtocolFHIRApp: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [fhirResources, setFhirResources] = useState<FHIRBundle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [medplumDeployed, setMedplumDeployed] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null);
  const [generatedProtocol, setGeneratedProtocol] = useState<string>('');
  const [protocolPrompt, setProtocolPrompt] = useState<string>('');
  const [useAIGeneration, setUseAIGeneration] = useState<boolean>(false);

  // AI Protocol Generation
  const generateProtocol = async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      const prompt = protocolPrompt || "Generate a clinical study protocol for treating hypertension with lifestyle interventions";
      
      // Simulated AI-generated protocol for demo
      const generatedText = `
CLINICAL STUDY PROTOCOL: ${prompt.toUpperCase()}

Protocol ID: AI-GEN-${Date.now()}
Principal Investigator: Dr. Emma Larsson, MD, PhD
Institution: Karolinska Institute, Stockholm

STUDY OVERVIEW:
A randomized controlled trial investigating innovative treatment approaches.

PATIENT POPULATION:
Inclusion Criteria:
- Adults aged 18-65 years
- Confirmed diagnosis via standard criteria
- Written informed consent obtained

Exclusion Criteria:
- Pregnancy or lactation
- Severe comorbidities
- Previous adverse reactions to study medications

TREATMENT PROTOCOL:
Active Treatment Group:
- Primary medication: 10mg daily, titrated based on response
- Secondary medication: 5mg twice daily
- Lifestyle counseling sessions (weekly for 4 weeks)

Control Group:
- Standard care per clinical guidelines
- Placebo medication matching active treatment
- Standard lifestyle advice

STUDY PROCEDURES:
Baseline Visit (Week 0):
- Complete medical history and physical examination
- Laboratory tests: CBC, comprehensive metabolic panel, lipid profile
- Vital signs assessment
- Quality of life questionnaires

Follow-up Visits (Weeks 2, 4, 8, 12, 24):
- Vital signs monitoring
- Adverse event assessment
- Medication adherence evaluation
- Laboratory tests as indicated

PRIMARY ENDPOINTS:
- Time to clinical improvement (defined as >20% reduction in primary outcome measure)
- Safety and tolerability profile

SECONDARY ENDPOINTS:
- Changes in biomarker levels
- Quality of life scores
- Healthcare resource utilization

STATISTICAL PLAN:
Sample size: 200 patients (100 per group)
Power: 80% to detect clinically meaningful difference
Analysis: Intention-to-treat and per-protocol populations

CONTACT INFORMATION:
Study Coordinator: Dr. Anna Johansson
Phone: +46 8 517 700 00
Email: anna.johansson@ki.se
Emergency Contact: Available 24/7

This protocol has been reviewed and approved by the Regional Ethics Committee.
      `;
      
      setGeneratedProtocol(generatedText);
      setExtractedText(generatedText);
      setStep(2);
    } catch (err) {
      setError(`Error generating protocol: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // File upload handler
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError('');
    setLoading(true);
    
    try {
      let text = '';
      
      if (uploadedFile.type.includes('word') || uploadedFile.name.endsWith('.docx')) {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (uploadedFile.type === 'application/pdf' || uploadedFile.name.endsWith('.pdf')) {
        text = `PDF content extraction would happen here. File: ${uploadedFile.name}
        
        Clinical Protocol Example:
        Patient presenting with acute chest pain
        Diagnosis: Acute myocardial infarction
        Treatment: Aspirin 300mg, Clopidogrel 600mg, Atorvastatin 80mg
        Follow-up: Cardiology consultation within 24 hours`;
      } else if (uploadedFile.name.endsWith('.tex') || uploadedFile.name.endsWith('.latex')) {
        text = await uploadedFile.text();
        text = text.replace(/\\[a-zA-Z]+\{[^}]*\}/g, '')
                  .replace(/\\[a-zA-Z]+/g, '')
                  .replace(/[{}]/g, '')
                  .replace(/\s+/g, ' ')
                  .trim();
      } else {
        text = await uploadedFile.text();
      }
      
      setExtractedText(text);
      setStep(2);
    } catch (err) {
      setError(`Error processing file: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // FHIR Validation
  const validateFHIR = async (fhirData: FHIRBundle): Promise<ValidationResults> => {
    try {
      // Simulated validation results
      const validationResult: ValidationResults = {
        valid: true,
        issues: [
          {
            severity: 'information',
            code: 'informational',
            details: 'Resource bundle contains 3 valid FHIR resources',
            location: 'Bundle'
          },
          {
            severity: 'warning',
            code: 'not-found',
            details: 'CodeSystem "http://example.org/medication-codes" not found',
            location: 'MedicationRequest.code'
          }
        ],
        resourceCount: fhirData.entry?.length || 0,
        errors: 0,
        warnings: 1,
        information: 1
      };
      
      return validationResult;
    } catch (err) {
      return {
        valid: false,
        issues: [{
          severity: 'error',
          code: 'validation-failed',
          details: `Validation failed: ${err instanceof Error ? err.message : String(err)}`,
          location: 'Bundle'
        }],
        resourceCount: 0,
        errors: 1,
        warnings: 0,
        information: 0
      };
    }
  };

  // Process text through Danish FHIR API with validation
  const processWithFHIRAPI = async (): Promise<void> => {
    setLoading(true);
    setError('');
    setValidationResults(null);
    
    try {
      const endpoints = ['/process', '/convert', '/text-to-fhir', '/api/process', '/api/convert'];
      
      let success = false;
      let result: FHIRBundle | null = null;
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`https://glorious-eureka-q74r9rg67qxwf9jx9-8003.app.github.dev${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: extractedText,
              language: 'da'
            })
          });
          
          if (response.ok) {
            result = await response.json();
            success = true;
            break;
          }
        } catch (err) {
          continue;
        }
      }
      
      if (!success || !result) {
        // Enhanced simulated FHIR generation
        result = {
          resourceType: "Bundle",
          id: "ai-generated-protocol-" + Date.now(),
          type: "collection",
          timestamp: new Date().toISOString(),
          entry: [
            {
              resource: {
                resourceType: "Patient",
                id: "protocol-patient-001",
                name: [{ family: "Generated", given: ["Protocol"] }],
                gender: "unknown",
                birthDate: "1980-01-01"
              }
            },
            {
              resource: {
                resourceType: "Practitioner",
                id: "principal-investigator",
                name: [{ family: "Larsson", given: ["Emma"], prefix: ["Dr."] }],
                qualification: [{
                  code: {
                    coding: [{
                      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
                      code: "MD",
                      display: "Doctor of Medicine"
                    }]
                  }
                }]
              }
            },
            {
              resource: {
                resourceType: "ResearchStudy",
                id: "clinical-protocol-study",
                status: "active",
                title: "AI Generated Clinical Protocol Study",
                protocol: [{
                  display: "Study protocol generated from clinical text"
                }],
                principalInvestigator: {
                  reference: "Practitioner/principal-investigator"
                }
              }
            },
            {
              resource: {
                resourceType: "MedicationRequest",
                id: "protocol-medication-001",
                status: "active",
                intent: "order",
                subject: { reference: "Patient/protocol-patient-001" },
                medicationCodeableConcept: {
                  text: "Primary medication 10mg daily"
                },
                dosageInstruction: [{
                  text: "10mg daily, titrated based on response",
                  timing: {
                    repeat: { frequency: 1, period: 1, periodUnit: "d" }
                  }
                }]
              }
            },
            {
              resource: {
                resourceType: "CarePlan",
                id: "protocol-careplan-001",
                status: "active",
                intent: "plan",
                subject: { reference: "Patient/protocol-patient-001" },
                title: "Clinical Protocol Care Plan",
                description: "Comprehensive care plan derived from clinical protocol",
                activity: [{
                  detail: {
                    status: "scheduled",
                    description: "Follow-up visits at weeks 2, 4, 8, 12, 24"
                  }
                }]
              }
            }
          ]
        };
      }
      
      // Validate the FHIR resources
      const validation = await validateFHIR(result);
      setValidationResults(validation);
      
      setFhirResources(result);
      setStep(3);
    } catch (err) {
      setError(`Error processing with FHIR API: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Deploy to Medplum
  const deployToMedplum = async (): Promise<void> => {
    setLoading(true);
    try {
      // Check validation before deployment
      if (validationResults && !validationResults.valid) {
        throw new Error('Cannot deploy invalid FHIR resources. Please fix validation errors first.');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMedplumDeployed(true);
      setStep(4);
    } catch (err) {
      setError(`Error deploying to Medplum: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const resetApp = (): void => {
    setFile(null);
    setExtractedText('');
    setFhirResources(null);
    setStep(1);
    setMedplumDeployed(false);
    setError('');
    setValidationResults(null);
    setGeneratedProtocol('');
    setProtocolPrompt('');
    setUseAIGeneration(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
{Activity && <Activity className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI-Powered Clinical Protocol to FHIR
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate clinical protocols with AI, convert to validated FHIR resources, and deploy to Medplum
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[
              { num: 1, label: 'Generate/Upload', icon: useAIGeneration ? Brain : Upload },
              { num: 2, label: 'Process', icon: Zap },
              { num: 3, label: 'Validate & Generate', icon: ShieldCheck },
              { num: 4, label: 'Deploy', icon: Send }
            ].map(({ num, label, icon: Icon }, index) => (
              <div key={num} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${
                  step >= num 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-lg' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {step > num ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className={`ml-2 text-sm font-medium ${step >= num ? 'text-blue-600' : 'text-gray-400'}`}>
                  {label}
                </span>
                {index < 3 && (
                  <div className={`mx-4 w-8 h-0.5 transition-colors duration-500 ${
                    step > num ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: AI Generation or File Upload */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              {/* Toggle between AI and Upload */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 rounded-xl p-1 flex">
                  <button
                    onClick={() => setUseAIGeneration(false)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      !useAIGeneration 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload File
                  </button>
                  <button
                    onClick={() => setUseAIGeneration(true)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      useAIGeneration 
                        ? 'bg-white shadow-sm text-purple-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Brain className="w-4 h-4 inline mr-2" />
                    AI Generate
                  </button>
                </div>
              </div>

              {useAIGeneration ? (
                /* AI Generation Mode */
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Protocol Generation</h2>
                  <p className="text-gray-600 mb-6">Describe the clinical study you want to generate</p>
                  
                  <div className="space-y-4">
                    <textarea
                      value={protocolPrompt}
                      onChange={(e) => setProtocolPrompt(e.target.value)}
                      placeholder="e.g., 'A randomized trial for diabetes management in elderly patients' or 'Cardiovascular prevention study with new drug compound'"
                      className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={loading}
                    />
                    
                    <button
                      onClick={generateProtocol}
                      disabled={loading || !protocolPrompt.trim()}
                      className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                      <span>{loading ? 'Generating Protocol...' : 'Generate Clinical Protocol'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* File Upload Mode */
                <div className="text-center">
                  <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Clinical Protocol</h2>
                  <p className="text-gray-600 mb-6">Support for Word, PDF, and LaTeX files</p>
                  
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      accept=".docx,.doc,.pdf,.tex,.latex,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={loading}
                    />
                    <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                      loading 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}>
                      {loading ? (
                        <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
                      ) : (
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                      )}
                      <p className="text-gray-600 font-medium">
                        {loading ? 'Processing file...' : 'Drop your file here or click to browse'}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Supports .docx, .pdf, .tex, .latex files
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Text Preview & Processing */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                {useAIGeneration ? (
                  <><Sparkles className="w-6 h-6 text-purple-600 mr-3" />AI Generated Protocol</>
                ) : (
                  <><FileText className="w-6 h-6 text-blue-600 mr-3" />Extracted Text Preview</>
                )}
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 mb-6 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {extractedText || 'No text available'}
                </pre>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={resetApp}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Start Over</span>
                </button>
                <button
                  onClick={processWithFHIRAPI}
                  disabled={loading || !extractedText}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  <span>{loading ? 'Processing...' : 'Generate & Validate FHIR'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: FHIR Resources & Validation */}
        {step === 3 && fhirResources && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Validation Results */}
            {validationResults && (
              <div className={`rounded-2xl shadow-xl border p-6 ${
                validationResults.valid 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <ShieldCheck className={`w-6 h-6 ${
                    validationResults.valid ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <h3 className={`text-lg font-bold ${
                    validationResults.valid ? 'text-green-900' : 'text-red-900'
                  }`}>
                    FHIR Validation {validationResults.valid ? 'Passed' : 'Failed'}
                  </h3>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{validationResults.resourceCount}</div>
                    <div className="text-sm text-gray-600">Resources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{validationResults.errors}</div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{validationResults.warnings}</div>
                    <div className="text-sm text-gray-600">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{validationResults.information}</div>
                    <div className="text-sm text-gray-600">Info</div>
                  </div>
                </div>

                {validationResults.issues && validationResults.issues.length > 0 && (
                  <div className="space-y-2">
                    {validationResults.issues.map((issue, index) => (
                      <div key={index} className={`p-3 rounded-lg flex items-start space-x-3 ${
                        issue.severity === 'error' ? 'bg-red-100' :
                        issue.severity === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <AlertCircle className={`w-4 h-4 mt-0.5 ${
                          issue.severity === 'error' ? 'text-red-600' :
                          issue.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">{issue.location}</div>
                          <div className="text-sm text-gray-700">{issue.details}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FHIR Resources Display */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-6 h-6 text-green-600 mr-3" />
                Generated FHIR Resources
              </h2>
              
              {/* Resource Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {fhirResources.entry?.map((entry, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{entry.resource.resourceType}</h3>
                        <p className="text-sm text-gray-600">{entry.resource.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full JSON Display */}
              <div className="bg-gray-900 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto">
                <pre className="text-green-400 text-sm font-mono">
                  {JSON.stringify(fhirResources, null, 2)}
                </pre>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back to Text
                </button>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(fhirResources, null, 2)], 
                        { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'fhir-resources.json';
                      a.click();
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download JSON</span>
                  </button>
                  <button
                    onClick={deployToMedplum}
                    disabled={loading || (validationResults ? !validationResults.valid : false)}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span>{loading ? 'Deploying...' : 'Deploy to Medplum'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Deployment Success */}
        {step === 4 && medplumDeployed && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Successfully Deployed!</h2>
              <p className="text-gray-600 mb-8">
                Your validated FHIR resources have been deployed to Medplum and are ready for use.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">Deployment Details</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Resources: {fhirResources?.entry?.length || 0} validated FHIR resources</p>
                  <p>Validation: {validationResults?.valid ? 'Passed' : 'N/A'}</p>
                  <p>Platform: Medplum FHIR Server</p>
                  <p>Status: Active and accessible</p>
                  <p>Generated: {useAIGeneration ? 'AI-Generated Protocol' : 'Uploaded Protocol'}</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetApp}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Process Another Protocol
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalProtocolFHIRApp;
import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Lightbulb,
  Upload,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Search,
  FileText,
  Check,
  AlertCircle
} from "lucide-react";
import { SOC2_QUESTIONNAIRE_DATA, SOC2Control, SOC2Question } from "../data/soc2QuestionnaireData";

export interface QuestionAnswer {
  selectedAnswerIndex?: number;
  customAnswerText?: string;
  isCustom?: boolean;
  uploadedEvidenceIds?: string[];
}

export type QuestionnaireAnswersState = Record<string, QuestionAnswer>; // Key: `${controlId}_q${qIndex}`

interface ControlQuestionnairesViewProps {
  answers: QuestionnaireAnswersState;
  onUpdateAnswer: (questionKey: string, answer: QuestionAnswer) => void;
  onUploadEvidence?: (controlId: string, evidenceName: string) => void;
}

export default function ControlQuestionnairesView({
  answers,
  onUpdateAnswer,
  onUploadEvidence
}: ControlQuestionnairesViewProps) {
  const controls = SOC2_QUESTIONNAIRE_DATA.controls;
  const [selectedControlIndex, setSelectedControlIndex] = useState(0);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeUploadTarget, setActiveUploadTarget] = useState<{ controlId: string; questionKey: string; question: string } | null>(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadSource, setUploadSource] = useState("Local File Upload");
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);

  const currentControl: SOC2Control = controls[selectedControlIndex] || controls[0];

  // Calculate overall progress across all questions in all controls
  const totalQuestions = controls.reduce((acc, ctrl) => acc + ctrl.questions.length, 0);
  
  const answeredQuestionsCount = controls.reduce((acc, ctrl, cIdx) => {
    let answeredInCtrl = 0;
    ctrl.questions.forEach((_, qIdx) => {
      const key = `${ctrl.id}_q${qIdx}`;
      const ans = answers[key];
      if (ans && (ans.selectedAnswerIndex !== undefined || (ans.isCustom && ans.customAnswerText?.trim()))) {
        answeredInCtrl++;
      }
    });
    return acc + answeredInCtrl;
  }, 0);

  const overallProgressPercentage = Math.round((answeredQuestionsCount / totalQuestions) * 100);

  // Check if a control is 100% completed
  const isControlCompleted = (ctrl: SOC2Control) => {
    return ctrl.questions.every((_, qIdx) => {
      const key = `${ctrl.id}_q${qIdx}`;
      const ans = answers[key];
      return ans && (ans.selectedAnswerIndex !== undefined || (ans.isCustom && ans.customAnswerText?.trim()));
    });
  };

  // Filtered controls list for search
  const filteredControls = controls.filter(
    (ctrl) =>
      ctrl.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ctrl.criterion.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ctrl.summary.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleNext = () => {
    if (selectedControlIndex < controls.length - 1) {
      setSelectedControlIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedControlIndex > 0) {
      setSelectedControlIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-slate-50/50 p-1 sm:p-4 rounded-2xl items-start">
      
      {/* Left Sidebar: Controls / Sections Navigation */}
      <div className="w-full lg:w-80 shrink-0 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between lg:sticky lg:top-20 lg:max-h-[calc(100vh-100px)]">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3 shrink-0">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Sections
            </h3>
            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
              {controls.length} Controls
            </span>
          </div>

          {/* Search Box */}
          <div className="relative mb-3 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter CC controls..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 py-1.5 outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>

          {/* List of Controls - dynamically fills height and enables full scrolling */}
          <div className="space-y-1.5 overflow-y-auto pr-1.5 flex-1 min-h-[380px] max-h-[calc(100vh-280px)] lg:max-h-[620px] scrollbar-thin">
            {filteredControls.map((ctrl) => {
              const actualIdx = controls.findIndex((c) => c.id === ctrl.id);
              const isSelected = actualIdx === selectedControlIndex;
              const completed = isControlCompleted(ctrl);

              return (
                <button
                  key={ctrl.id}
                  type="button"
                  onClick={() => setSelectedControlIndex(actualIdx)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  {/* Circle status indicator */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      completed
                        ? "bg-emerald-100 text-emerald-700"
                        : isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    {completed ? <Check className="w-3 h-3 stroke-[3]" /> : actualIdx + 1}
                  </div>

                  <span className="truncate flex-1 font-medium">
                    <strong className="font-bold">{ctrl.id}</strong> - {ctrl.criterion}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overall Progress Widget */}
        <div className="pt-4 border-t border-slate-100 mt-4 shrink-0">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-slate-500 uppercase text-[10px] tracking-wider">Overall Progress</span>
            <span className="text-blue-600 font-extrabold">{overallProgressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgressPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 text-right font-medium">
            {answeredQuestionsCount} of {totalQuestions} questions answered
          </p>
        </div>
      </div>

      {/* Main Questionnaire Panel */}
      <div className="flex-1 bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Control Header */}
        <div className="space-y-1.5 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-extrabold rounded-md border border-blue-100">
              Control Environment
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Section {selectedControlIndex + 1} of {controls.length}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {currentControl.id} - {currentControl.criterion}
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {currentControl.summary}
          </p>
        </div>

        {/* Questions List for Current Control */}
        <div className="space-y-8">
          {currentControl.questions.map((qItem: SOC2Question, qIdx: number) => {
            const questionKey = `${currentControl.id}_q${qIdx}`;
            const currentAns = answers[questionKey] || {};

            return (
              <div
                key={qIdx}
                className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Question Title */}
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  Q: {qItem.question}
                </h4>

                {/* Sample Options (Radio choices) */}
                <div className="space-y-3">
                  {qItem.sample_answers.map((sampleText: string, sampleIdx: number) => {
                    const isSelected = !currentAns.isCustom && currentAns.selectedAnswerIndex === sampleIdx;

                    return (
                      <div
                        key={sampleIdx}
                        onClick={() => {
                          onUpdateAnswer(questionKey, {
                            selectedAnswerIndex: sampleIdx,
                            isCustom: false,
                            customAnswerText: currentAns.customAnswerText
                          });
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? "bg-blue-50/50 border-blue-500 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isSelected ? (
                            <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center bg-blue-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <span
                            className={`text-xs font-bold block ${
                              isSelected ? "text-blue-900" : "text-slate-800"
                            }`}
                          >
                            {sampleText.split(".")[0] || sampleText}
                          </span>
                          <p
                            className={`text-xs leading-relaxed ${
                              isSelected ? "text-blue-800" : "text-slate-500"
                            }`}
                          >
                            {sampleText}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Custom Answer Option */}
                  <div
                    onClick={() => {
                      if (!currentAns.isCustom) {
                        onUpdateAnswer(questionKey, {
                          selectedAnswerIndex: undefined,
                          isCustom: true,
                          customAnswerText: currentAns.customAnswerText || ""
                        });
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      currentAns.isCustom
                        ? "bg-blue-50/50 border-blue-500 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {currentAns.isCustom ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center bg-blue-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      <span
                        className={`text-xs font-bold block ${
                          currentAns.isCustom ? "text-blue-900" : "text-slate-800"
                        }`}
                      >
                        Custom Answer
                      </span>

                      {currentAns.isCustom ? (
                        <textarea
                          rows={3}
                          placeholder="Type your specific process here..."
                          value={currentAns.customAnswerText || ""}
                          onChange={(e) => {
                            onUpdateAnswer(questionKey, {
                              selectedAnswerIndex: undefined,
                              isCustom: true,
                              customAnswerText: e.target.value
                            });
                          }}
                          className="w-full text-xs text-slate-800 bg-white border border-blue-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                        />
                      ) : (
                        <p className="text-xs text-slate-400 font-medium">
                          Select to specify a custom control process or response...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Evidence Suggestions Callout Box */}
                {qItem.evidence_examples && qItem.evidence_examples.length > 0 && (
                  <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Evidence Suggestions</span>
                    </div>

                    <ul className="text-xs text-slate-600 space-y-1 pl-5 list-disc font-medium leading-relaxed">
                      {qItem.evidence_examples.map((item, eIdx) => (
                        <li key={eIdx}>{item}</li>
                      ))}
                    </ul>

                    {/* Attached Evidence Artifacts List */}
                    {currentAns.uploadedEvidenceIds && currentAns.uploadedEvidenceIds.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Attached Evidence Files:</span>
                        <div className="flex flex-wrap gap-2">
                          {currentAns.uploadedEvidenceIds.map((evItem, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                              <FileText className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{evItem}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-1 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveUploadTarget({
                            controlId: currentControl.id,
                            questionKey,
                            question: qItem.question
                          });
                          setUploadFileName(`${currentControl.id}_evidence_log_${Date.now().toString().slice(-4)}.pdf`);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Attach Evidence</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Action Bar */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={selectedControlIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
              selectedControlIndex === 0
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={selectedControlIndex === controls.length - 1}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
              selectedControlIndex === controls.length - 1
                ? "bg-slate-400 cursor-not-allowed opacity-60"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <span>Save & Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Upload Evidence Dialog Modal */}
      {activeUploadTarget && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
            <div className="bg-slate-900 text-white p-5">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Attach Evidence for {activeUploadTarget.controlId}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {activeUploadTarget.question}
              </p>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!uploadFileName.trim()) return;

                const prevAns = answers[activeUploadTarget.questionKey] || {};
                const prevList = prevAns.uploadedEvidenceIds || [];
                const updatedList = [...prevList, uploadFileName.trim()];

                onUpdateAnswer(activeUploadTarget.questionKey, {
                  ...prevAns,
                  uploadedEvidenceIds: updatedList
                });

                if (onUploadEvidence) {
                  onUploadEvidence(activeUploadTarget.controlId, uploadFileName.trim());
                }

                setUploadSuccessToast(`Attached "${uploadFileName.trim()}" to ${activeUploadTarget.controlId}`);
                setTimeout(() => setUploadSuccessToast(null), 3500);
                setActiveUploadTarget(null);
              }}
              className="p-5 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Evidence File Name / Artifact Reference</label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g. AWS_IAM_MFA_Enforcement_Export.json"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Evidence Repository / Source</label>
                <select
                  value={uploadSource}
                  onChange={(e) => setUploadSource(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 font-medium"
                >
                  <option value="Local File Upload">Local File Artifact (.pdf / .json / .csv)</option>
                  <option value="AWS Security Hub">AWS Security Hub Automated Evidence</option>
                  <option value="GitHub Enterprise">GitHub CI/CD Signed Commit Trace</option>
                  <option value="Jira Compliance Ticket">Jira Compliance Ticket / Audit Trail</option>
                  <option value="Datadog Logs">Datadog Guardrail Telemetry Export</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Artifact will be hashed with SHA-256 and linked directly to this control's verification dossier.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveUploadTarget(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Confirm &amp; Attach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification Toast */}
      {uploadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-scale-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccessToast}</span>
        </div>
      )}
    </div>
  );
}

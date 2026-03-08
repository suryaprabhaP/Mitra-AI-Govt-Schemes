import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, CheckCircle2, Clock, AlertCircle, ChevronRight,
    Trash2, FileText, Calendar, User, MapPin, Briefcase, IndianRupee,
    RefreshCw, Inbox
} from 'lucide-react';

const statusConfig = {
    submitted: {
        label: 'Submitted',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: Clock,
        dot: 'bg-blue-500',
    },
    under_review: {
        label: 'Under Review',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: RefreshCw,
        dot: 'bg-amber-500',
    },
    approved: {
        label: 'Approved',
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: CheckCircle2,
        dot: 'bg-green-500',
    },
    rejected: {
        label: 'Rejected',
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: AlertCircle,
        dot: 'bg-red-500',
    },
};

const langLabels = {
    en: { title: 'My Applied Schemes', subtitle: 'Track the status of your scheme applications', empty: 'No applications yet', emptyDesc: 'Apply for government schemes to see them here.', delete: 'Delete', appliedOn: 'Applied on', status: 'Status', schemeId: 'Application ID', browseSchemes: 'Browse Schemes', details: 'Details', name: 'Name', age: 'Age', state: 'State', occupation: 'Occupation', income: 'Annual Income' },
    hi: { title: 'मेरी योजनाएं', subtitle: 'अपने आवेदनों की स्थिति ट्रैक करें', empty: 'कोई आवेदन नहीं', emptyDesc: 'योजनाओं के लिए आवेदन करें।', delete: 'हटाएं', appliedOn: 'आवेदन की तारीख', status: 'स्थिति', schemeId: 'आवेदन ID', browseSchemes: 'योजनाएं देखें', details: 'विवरण', name: 'नाम', age: 'उम्र', state: 'राज्य', occupation: 'व्यवसाय', income: 'वार्षिक आय' },
    ta: { title: 'என் திட்டங்கள்', subtitle: 'உங்கள் விண்ணப்ப நிலையை கண்காணிக்கவும்', empty: 'விண்ணப்பம் இல்லை', emptyDesc: 'திட்டங்களுக்கு விண்ணப்பிக்கவும்.', delete: 'நீக்கு', appliedOn: 'விண்ணப்பித்த தேதி', status: 'நிலை', schemeId: 'விண்ணப்ப ID', browseSchemes: 'திட்டங்கள் காண்க', details: 'விவரங்கள்', name: 'பெயர்', age: 'வயது', state: 'மாநிலம்', occupation: 'தொழில்', income: 'வருடாந்திர வருமானம்' },
    te: { title: 'నా పథకాలు', subtitle: 'మీ దరఖాస్తు స్థితిని ట్రాక్ చేయండి', empty: 'దరఖాస్తులు లేవు', emptyDesc: 'పథకాలకు దరఖాస్తు చేయండి.', delete: 'తొలగించు', appliedOn: 'దరఖాస్తు చేసిన తేదీ', status: 'స్థితి', schemeId: 'దరఖాస్తు ID', browseSchemes: 'పథకాలు చూడండి', details: 'వివరాలు', name: 'పేరు', age: 'వయసు', state: 'రాష్ట్రం', occupation: 'వృత్తి', income: 'వార్షిక ఆదాయం' },
    kn: { title: 'ನನ್ನ ಯೋಜನೆಗಳು', subtitle: 'ನಿಮ್ಮ ಅರ್ಜಿ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', empty: 'ಯಾವುದೇ ಅರ್ಜಿ ಇಲ್ಲ', emptyDesc: 'ಯೋಜನೆಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.', delete: 'ಅಳಿಸಿ', appliedOn: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ ದಿನಾಂಕ', status: 'ಸ್ಥಿತಿ', schemeId: 'ಅರ್ಜಿ ID', browseSchemes: 'ಯೋಜನೆಗಳನ್ನು ನೋಡಿ', details: 'ವಿವರಗಳು', name: 'ಹೆಸರು', age: 'ವಯಸ್ಸು', state: 'ರಾಜ್ಯ', occupation: 'ಉದ್ಯೋಗ', income: 'ವಾರ್ಷಿಕ ಆದಾಯ' },
    ml: { title: 'എന്റെ പദ്ധതികൾ', subtitle: 'അപേക്ഷ നില ട്രാക്ക് ചെയ്യുക', empty: 'അപേക്ഷകൾ ഇല്ല', emptyDesc: 'പദ്ധതികൾക്ക് അപേക്ഷിക്കുക.', delete: 'ഇല്ലാതാക്കുക', appliedOn: 'അപേക്ഷ തീയതി', status: 'നില', schemeId: 'അപേക്ഷ ID', browseSchemes: 'പദ്ധതികൾ കാണുക', details: 'വിവരങ്ങൾ', name: 'പേര്', age: 'പ്രായം', state: 'സംസ്ഥാനം', occupation: 'തൊഴിൽ', income: 'വാർഷിക വരുമാനം' },
    bn: { title: 'আমার স্কিম', subtitle: 'আপনার আবেদনের অবস্থা ট্র্যাক করুন', empty: 'কোনো আবেদন নেই', emptyDesc: 'স্কিমে আবেদন করুন।', delete: 'মুছুন', appliedOn: 'আবেদনের তারিখ', status: 'অবস্থা', schemeId: 'আবেদন ID', browseSchemes: 'স্কিম দেখুন', details: 'বিস্তারিত', name: 'নাম', age: 'বয়স', state: 'রাজ্য', occupation: 'পেশা', income: 'বার্ষিক আয়' },
    mr: { title: 'माझ्या योजना', subtitle: 'अर्जाचा दर्जा ट्रॅक करा', empty: 'कोणतेही अर्ज नाहीत', emptyDesc: 'योजनांसाठी अर्ज करा.', delete: 'हटवा', appliedOn: 'अर्जाची तारीख', status: 'दर्जा', schemeId: 'अर्ज ID', browseSchemes: 'योजना पहा', details: 'तपशील', name: 'नाव', age: 'वय', state: 'राज्य', occupation: 'व्यवसाय', income: 'वार्षिक उत्पन्न' },
    gu: { title: 'મારી યોજનાઓ', subtitle: 'અરજીની સ્થિતિ ટ્રૅક કરો', empty: 'કોઈ અરજી નથી', emptyDesc: 'યોજનાઓ માટે અરજી કરો.', delete: 'ઑળ', appliedOn: 'અરજીની તારીખ', status: 'સ્થિતિ', schemeId: 'અરજી ID', browseSchemes: 'યોજના જુઓ', details: 'વિગત', name: 'નામ', age: 'ઉંમર', state: 'રાજ્ય', occupation: 'વ્યવસાય', income: 'વાર્ષિક આવક' },
    pa: { title: 'ਮੇਰੀਆਂ ਸਕੀਮਾਂ', subtitle: 'ਅਰਜ਼ੀ ਦਾ ਦਰਜਾ ਟਰੈਕ ਕਰੋ', empty: 'ਕੋਈ ਅਰਜ਼ੀ ਨਹੀਂ', emptyDesc: 'ਸਕੀਮਾਂ ਲਈ ਅਰਜ਼ੀ ਦਿਓ।', delete: 'ਹਟਾਓ', appliedOn: 'ਅਰਜ਼ੀ ਦੀ ਮਿਤੀ', status: 'ਸਥਿਤੀ', schemeId: 'ਅਰਜ਼ੀ ID', browseSchemes: 'ਸਕੀਮਾਂ ਦੇਖੋ', details: 'ਵੇਰਵੇ', name: 'ਨਾਮ', age: 'ਉਮਰ', state: 'ਰਾਜ', occupation: 'ਕਿੱਤਾ', income: 'ਸਾਲਾਨਾ ਆਮਦਨ' },
};

const STORAGE_KEY = 'mitra_applied_schemes';

// Simulate gradual status progression for demo
const simulateStatus = (submittedAt) => {
    const now = Date.now();
    const diff = now - submittedAt;
    const minutes = diff / 60000;
    if (minutes < 1) return 'submitted';
    if (minutes < 3) return 'under_review';
    // Randomly approved or rejected after 3 minutes (deterministic based on id)
    return 'approved';
};

const MySchemes = ({ globalLanguage }) => {
    const navigate = useNavigate();
    const lang = globalLanguage || 'en';
    const t = langLabels[lang] || langLabels['en'];

    const [applications, setApplications] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const userPhone = localStorage.getItem('mitra_userPhone');
                const url = userPhone
                    ? `https://bzrh276laa.execute-api.us-east-1.amazonaws.com/api/applications?phone=${userPhone}`
                    : `https://bzrh276laa.execute-api.us-east-1.amazonaws.com/api/applications`;

                const response = await axios.get(url);
                const appsFromAWS = response.data;

                const updated = appsFromAWS.map(app => ({
                    ...app,
                    id: app.applicationId || app.id,
                    currentStatus: simulateStatus(new Date(app.timestamp).getTime() || app.submittedAt || Date.now()),
                    submittedAt: new Date(app.timestamp).getTime() || app.submittedAt || Date.now()
                }));

                // Sort by most recent
                updated.sort((a, b) => b.submittedAt - a.submittedAt);
                setApplications(updated);
            } catch (error) {
                console.error("Failed to fetch applications from AWS", error);
            }
        };

        fetchApplications();
    }, []);

    const handleDelete = (id) => {
        const updated = applications.filter(a => a.id !== id);
        setApplications(updated);
        setDeleteConfirm(null);
    };

    const formatDate = (ts) => {
        return new Date(ts).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const statusSteps = ['submitted', 'under_review', 'approved'];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Page Header */}
            <div className="bg-india-navy text-white">
                <div className="max-w-5xl mx-auto px-4 py-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-2xl">
                            <ClipboardList className="w-8 h-8 text-india-saffron" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">{t.title}</h1>
                            <p className="text-white/60 text-sm mt-0.5">{t.subtitle}</p>
                        </div>
                    </div>

                    {/* Summary pills */}
                    {applications.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-6">
                            {Object.entries(statusConfig).map(([key, cfg]) => {
                                const count = applications.filter(a => a.currentStatus === key).length;
                                if (count === 0) return null;
                                return (
                                    <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                                        {cfg.label}: {count}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {applications.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Inbox className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-700 mb-2">{t.empty}</h2>
                        <p className="text-gray-400 text-sm mb-6">{t.emptyDesc}</p>
                        <button
                            onClick={() => navigate('/all-schemes')}
                            className="bg-india-navy text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-900 transition-colors shadow-md"
                        >
                            {t.browseSchemes}
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {applications.map((app, idx) => {
                                const cfg = statusConfig[app.currentStatus] || statusConfig.submitted;
                                const StatusIcon = cfg.icon;
                                const isExpanded = expandedId === app.id;
                                const stepIdx = statusSteps.indexOf(app.currentStatus);

                                return (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                                    >
                                        {/* Card Top */}
                                        <div
                                            className="p-5 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                            onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                        >
                                            {/* Status icon circle */}
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                                                <StatusIcon className={`w-5 h-5 ${cfg.color} ${app.currentStatus === 'under_review' ? 'animate-spin' : ''}`} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-bold text-india-navy text-sm leading-tight truncate">{app.schemeName}</h3>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(app.submittedAt)}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 font-mono">#{app.id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>

                                            <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        </div>

                                        {/* Progress Tracker */}
                                        {app.currentStatus !== 'rejected' && (
                                            <div className="px-5 pb-3">
                                                <div className="flex items-center gap-0">
                                                    {statusSteps.map((step, i) => {
                                                        const completed = i <= stepIdx;
                                                        const active = i === stepIdx;
                                                        return (
                                                            <React.Fragment key={step}>
                                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${completed ? 'bg-india-green' : 'bg-gray-200'} ${active ? 'ring-2 ring-india-green/30 scale-110' : ''}`}>
                                                                    {completed && (
                                                                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                {i < statusSteps.length - 1 && (
                                                                    <div className={`h-0.5 flex-1 transition-all ${i < stepIdx ? 'bg-india-green' : 'bg-gray-200'}`} />
                                                                )}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </div>
                                                <div className="flex justify-between mt-1">
                                                    {statusSteps.map((step) => (
                                                        <span key={step} className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                                            {statusConfig[step].label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {app.currentStatus === 'rejected' && (
                                            <div className="px-5 pb-3">
                                                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600 font-medium flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                    Application was not approved. Please review eligibility criteria and reapply.
                                                </div>
                                            </div>
                                        )}

                                        {/* Expandable Details */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">{t.details}</p>
                                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                                                            {app.applicantName && (
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <User className="w-3.5 h-3.5 text-india-navy/50" />
                                                                    <span className="text-gray-500">{t.name}:</span>
                                                                    <span className="font-bold text-india-navy truncate">{app.applicantName}</span>
                                                                </div>
                                                            )}
                                                            {app.age && (
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <Calendar className="w-3.5 h-3.5 text-india-navy/50" />
                                                                    <span className="text-gray-500">{t.age}:</span>
                                                                    <span className="font-bold text-india-navy">{app.age}</span>
                                                                </div>
                                                            )}
                                                            {app.stateLoc && (
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <MapPin className="w-3.5 h-3.5 text-india-navy/50" />
                                                                    <span className="text-gray-500">{t.state}:</span>
                                                                    <span className="font-bold text-india-navy">{app.stateLoc}</span>
                                                                </div>
                                                            )}
                                                            {app.occupation && (
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <Briefcase className="w-3.5 h-3.5 text-india-navy/50" />
                                                                    <span className="text-gray-500">{t.occupation}:</span>
                                                                    <span className="font-bold text-india-navy">{app.occupation}</span>
                                                                </div>
                                                            )}
                                                            {app.income && (
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <IndianRupee className="w-3.5 h-3.5 text-india-navy/50" />
                                                                    <span className="text-gray-500">{t.income}:</span>
                                                                    <span className="font-bold text-india-navy">₹{app.income}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-2 text-xs">
                                                                <FileText className="w-3.5 h-3.5 text-india-navy/50" />
                                                                <span className="text-gray-500">{t.schemeId}:</span>
                                                                <span className="font-mono font-bold text-india-navy">#{app.id.slice(-8).toUpperCase()}</span>
                                                            </div>
                                                        </div>

                                                        {/* Delete */}
                                                        {deleteConfirm === app.id ? (
                                                            <div className="mt-4 flex items-center gap-2">
                                                                <span className="text-xs text-gray-500">Are you sure?</span>
                                                                <button onClick={() => handleDelete(app.id)} className="text-xs text-red-600 font-bold border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors">Yes, remove</button>
                                                                <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 font-bold border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">Cancel</button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setDeleteConfirm(app.id)}
                                                                className="mt-4 flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                {t.delete}
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export { STORAGE_KEY };
export default MySchemes;

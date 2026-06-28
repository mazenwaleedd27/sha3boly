// كل بيانات اللعبة: المواضيع، الحروف، كروت القوة والتلبيس

export const ARABIC_LETTERS = [
  "ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"
];

export type TopicCard = {
  title: string;
  hint: string;
  needsLetter: boolean;
  category: string;
};

export const TOPICS: TopicCard[] = [
  // ثقافة عامة
  { title: "دول", hint: "قول اسم دولة", needsLetter: true, category: "ثقافة" },
  { title: "مدن", hint: "قول اسم مدينة", needsLetter: true, category: "ثقافة" },
  { title: "عواصم", hint: "قول اسم عاصمة", needsLetter: true, category: "ثقافة" },
  { title: "أنهار", hint: "قول اسم نهر", needsLetter: true, category: "ثقافة" },
  { title: "بحار", hint: "قول اسم بحر", needsLetter: true, category: "ثقافة" },
  { title: "جبال", hint: "قول اسم جبل", needsLetter: true, category: "ثقافة" },
  { title: "جزر", hint: "قول اسم جزيرة", needsLetter: true, category: "ثقافة" },
  { title: "لغات", hint: "قول اسم لغة", needsLetter: true, category: "ثقافة" },
  { title: "عملات", hint: "قول اسم عملة", needsLetter: true, category: "ثقافة" },
  { title: "علماء", hint: "قول اسم عالم", needsLetter: true, category: "ثقافة" },
  { title: "حضارات", hint: "قول اسم حضارة", needsLetter: true, category: "ثقافة" },
  { title: "اختراعات", hint: "قول اسم اختراع", needsLetter: true, category: "ثقافة" },
  // أكل وشرب
  { title: "أكلات ومشروبات", hint: "قول اسم أكلة، طبخة، أو مشروب", needsLetter: true, category: "أكل" },
  { title: "أكلات مصرية", hint: "قول اسم أكلة مصرية", needsLetter: true, category: "أكل" },
  { title: "أكلات عربية", hint: "قول اسم أكلة عربية", needsLetter: true, category: "أكل" },
  { title: "حلويات", hint: "قول اسم حلو", needsLetter: true, category: "أكل" },
  { title: "فواكه", hint: "قول اسم فاكهة", needsLetter: true, category: "أكل" },
  { title: "خضروات", hint: "قول اسم خضار", needsLetter: true, category: "أكل" },
  { title: "مشروبات", hint: "قول اسم مشروب", needsLetter: true, category: "أكل" },
  { title: "أكلات بحرية", hint: "قول اسم أكلة بحرية", needsLetter: true, category: "أكل" },
  { title: "أكلات في رمضان", hint: "قول حاجة بتتاكل في رمضان", needsLetter: true, category: "أكل" },
  // حيوانات وطبيعة
  { title: "حيوانات", hint: "قول اسم حيوان", needsLetter: true, category: "طبيعة" },
  { title: "طيور", hint: "قول اسم طير", needsLetter: true, category: "طبيعة" },
  { title: "أسماك", hint: "قول اسم سمكة", needsLetter: true, category: "طبيعة" },
  { title: "نباتات", hint: "قول اسم نبات", needsLetter: true, category: "طبيعة" },
  { title: "زهور", hint: "قول اسم زهرة", needsLetter: true, category: "طبيعة" },
  { title: "كواكب", hint: "قول اسم كوكب", needsLetter: true, category: "طبيعة" },
  // فن وترفيه
  { title: "أفلام", hint: "قول اسم فيلم", needsLetter: true, category: "فن" },
  { title: "مسلسلات", hint: "قول اسم مسلسل", needsLetter: true, category: "فن" },
  { title: "مسلسلات مصرية", hint: "قول اسم مسلسل مصري", needsLetter: true, category: "فن" },
  { title: "أفلام كرتون", hint: "قول اسم فيلم كرتون", needsLetter: true, category: "فن" },
  { title: "شخصيات كرتونية", hint: "قول اسم شخصية كرتون", needsLetter: true, category: "فن" },
  { title: "أغاني", hint: "قول اسم أغنية", needsLetter: true, category: "فن" },
  { title: "مغنيين", hint: "قول اسم مغني", needsLetter: true, category: "فن" },
  { title: "ممثلين", hint: "قول اسم ممثل", needsLetter: true, category: "فن" },
  { title: "ممثلات", hint: "قول اسم ممثلة", needsLetter: true, category: "فن" },
  { title: "يوتيوبرز", hint: "قول اسم يوتيوبر", needsLetter: true, category: "فن" },
  { title: "أفلام رعب", hint: "قول اسم فيلم رعب", needsLetter: true, category: "فن" },
  // رياضة
  { title: "رياضات", hint: "قول اسم رياضة", needsLetter: true, category: "رياضة" },
  { title: "لاعبين كرة قدم", hint: "قول اسم لاعب كورة", needsLetter: true, category: "رياضة" },
  { title: "أندية كرة قدم", hint: "قول اسم نادي", needsLetter: true, category: "رياضة" },
  { title: "لاعبين مصريين", hint: "قول اسم لاعب مصري", needsLetter: true, category: "رياضة" },
  // أشياء يومية
  { title: "أدوات منزلية", hint: "قول حاجة في البيت", needsLetter: true, category: "يومي" },
  { title: "أدوات المطبخ", hint: "قول حاجة في المطبخ", needsLetter: true, category: "يومي" },
  { title: "أدوات المدرسة", hint: "قول حاجة في الشنطة", needsLetter: true, category: "يومي" },
  { title: "وسائل نقل", hint: "قول وسيلة مواصلات", needsLetter: true, category: "يومي" },
  { title: "ملابس", hint: "قول قطعة لبس", needsLetter: true, category: "يومي" },
  // تكنولوجيا
  { title: "تطبيقات موبايل", hint: "قول اسم تطبيق", needsLetter: true, category: "تكنولوجيا" },
  { title: "مواقع إنترنت", hint: "قول اسم موقع", needsLetter: true, category: "تكنولوجيا" },
  { title: "ألعاب فيديو", hint: "قول اسم لعبة", needsLetter: true, category: "تكنولوجيا" },
  { title: "ماركات موبايلات", hint: "قول ماركة موبايل", needsLetter: true, category: "تكنولوجيا" },
  // أماكن
  { title: "مدن مصرية", hint: "قول اسم مدينة في مصر", needsLetter: true, category: "أماكن" },
  { title: "محافظات مصر", hint: "قول محافظة", needsLetter: true, category: "أماكن" },
  { title: "أماكن سياحية", hint: "قول مكان سياحي", needsLetter: true, category: "أماكن" },
  // متنوعة
  { title: "هوايات", hint: "قول هواية", needsLetter: true, category: "متنوع" },
  { title: "مهن", hint: "قول اسم مهنة", needsLetter: true, category: "متنوع" },

  // مواضيع بدون حرف
  { title: "أشياء تطير", hint: "قول حاجة بتطير", needsLetter: false, category: "تفكير" },
  { title: "أشياء تسبح", hint: "قول حاجة بتعوم", needsLetter: false, category: "تفكير" },
  { title: "أشياء سريعة", hint: "قول حاجة سريعة", needsLetter: false, category: "تفكير" },
  { title: "أشياء كبيرة", hint: "قول حاجة كبيرة", needsLetter: false, category: "تفكير" },
  { title: "أشياء صغيرة", hint: "قول حاجة صغيرة", needsLetter: false, category: "تفكير" },
  { title: "أشياء ثقيلة", hint: "قول حاجة تقيلة", needsLetter: false, category: "تفكير" },
  { title: "أشياء غالية", hint: "قول حاجة غالية", needsLetter: false, category: "تفكير" },
  { title: "أشياء بنحبها", hint: "قول حاجة بتحبها", needsLetter: false, category: "تفكير" },
  { title: "أشياء بنكرهها", hint: "قول حاجة بتكرهها", needsLetter: false, category: "تفكير" },
  { title: "أشياء مضحكة", hint: "قول حاجة مضحكة", needsLetter: false, category: "تفكير" },
  { title: "أشياء مخيفة", hint: "قول حاجة مخيفة", needsLetter: false, category: "تفكير" },

  // مواضيع مجنونة ومضحكة
  { title: "أعذار غريبة للتأخير", hint: "اخترع عذر يضحك", needsLetter: false, category: "مضحك" },
  { title: "أشياء بنخاف منها وإحنا كبار", hint: "قول حاجة لسه بتخوفك", needsLetter: false, category: "مضحك" },
  { title: "أشياء بنعملها لما نكون لوحدنا", hint: "اعترف بحاجة بتعملها", needsLetter: false, category: "مضحك" },
  { title: "أشياء بتحصل في الأفراح", hint: "موقف في فرح", needsLetter: false, category: "مضحك" },
  { title: "أشياء بتحصل في الامتحانات", hint: "موقف في امتحان", needsLetter: false, category: "مضحك" },
  { title: "أشياء بنعملها لما النت يقطع", hint: "اعمل إيه لما النت يفصل", needsLetter: false, category: "مضحك" },
  { title: "أشياء بنشتريها وبنندم", hint: "حاجة اشتريتها وندمت", needsLetter: false, category: "مضحك" },
];

export type PowerCard = {
  name: string;
  desc: string;
  kind: "power" | "trap";
  emoji: string;
};

export const POWER_CARDS: PowerCard[] = [
  // قوة - وقت
  { name: "وقت إضافي +10", desc: "زود وقتك 10 ثواني", kind: "power", emoji: "⏱️" },
  { name: "وقت ذهبي", desc: "أوقف التايمر لحد ما تخلص إجابة واحدة", kind: "power", emoji: "✨" },
  { name: "إعادة التفكير", desc: "ارجع التايمر للأول مرة واحدة", kind: "power", emoji: "🔄" },
  // قوة - حماية
  { name: "درع الحماية", desc: "اتجاهل أول كارت تلبيس يترمى عليك", kind: "power", emoji: "🛡️" },
  { name: "صد الفخ", desc: "ارجع كارت التلبيس لصاحبه", kind: "power", emoji: "🪞" },
  { name: "حصانة الجولة", desc: "محدش يقدر يلعب عليك كارت في الجولة دي", kind: "power", emoji: "🏰" },
  // قوة - مساعدة
  { name: "تغيير الحرف", desc: "اسحب حرف جديد", kind: "power", emoji: "🔠" },
  { name: "تغيير الموضوع", desc: "اسحب موضوع جديد", kind: "power", emoji: "🔀" },
  { name: "تجاهل الحرف", desc: "جاوب من غير شرط الحرف", kind: "power", emoji: "🆓" },
  // قوة - نقاط
  { name: "دابل نقاط", desc: "نقاط الجولة دي بتتضاعف ليك", kind: "power", emoji: "💎" },
  { name: "سرقة 5 نقاط", desc: "خد 5 نقاط من أي لاعب", kind: "power", emoji: "🦹" },
  { name: "+10 نقاط", desc: "زود رصيدك 10 نقاط على طول", kind: "power", emoji: "💰" },
  // قوة - استراتيجية
  { name: "تخطي الدور", desc: "متلعبش الجولة دي ومتخسرش", kind: "power", emoji: "⏭️" },
  { name: "سرقة الدور", desc: "خد دور اللاعب اللي بعدك", kind: "power", emoji: "🎭" },
  { name: "لعب مرتين", desc: "العب الجولة دي مرتين وخد أحسن نتيجة", kind: "power", emoji: "🔁" },

  // تلبيس - وقت
  { name: "3 ثواني بس", desc: "اللاعب اللي عليه الدور وقته يبقى 3 ثواني", kind: "trap", emoji: "⏰" },
  { name: "نص الوقت", desc: "وقت اللاعب يتنص", kind: "trap", emoji: "✂️" },
  { name: "تقليل وقت الكل 5 ثواني", desc: "وقت كل اللاعبين ينقص 5 ثواني في الجولة دي", kind: "trap", emoji: "⏳" },
  // تلبيس - شروط
  { name: "إجابتين مكان وحدة", desc: "اللاعب لازم يقول إجابتين في الموضوع ده", kind: "trap", emoji: "✌️" },
  { name: "3 أضعاف الإجابات", desc: "اللاعب لازم يجيب 3 أضعاف اللي قاله", kind: "trap", emoji: "📈" },
  { name: "حذف حرف", desc: "احذف حرف من الإجابات المتاحة", kind: "trap", emoji: "❌" },
  { name: "اضحك في الإجابة", desc: "اللاعب لازم يضحك وهو بيجاوب", kind: "trap", emoji: "🤣" },
  { name: "إجابة بشرط", desc: "أضف شرط لإجاباته (مثلاً كلها أكلات حلوة)", kind: "trap", emoji: "🪤" },
  // تلبيس - تخريب
  { name: "لغم!", desc: "اللاعب يبدأ التايمر من غير وقت تفكير", kind: "trap", emoji: "💣" },
  { name: "ضغط التايمر", desc: "التايمر يعد بسرعة مضاعفة", kind: "trap", emoji: "⚡" },
  { name: "اختر اللاعب التالي", desc: "اللي ضربك بالكارت يختار مين يجي بعدك", kind: "trap", emoji: "🎯" },
  { name: "تبديل الحرف", desc: "اسحب حرف جديد للاعب", kind: "trap", emoji: "🔄" },
  { name: "تأخير الدور", desc: "اللاعب يستنى دورين قبل ما يلعب", kind: "trap", emoji: "🐌" },
  { name: "قنبلة!", desc: "اللاعب يخسر 5 نقاط فوراً", kind: "trap", emoji: "💥" },
  { name: "سرقة كارت", desc: "اللي ضربك بالكارت يسحب كارت من إيدك", kind: "trap", emoji: "🦝" },
];

export type GameMode = {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  desc: string;
  rules: string[];
};

export const GAME_MODES: GameMode[] = [
  {
    id: "auction", name: "المزاد", subtitle: "ثقة ومخاطرة", emoji: "🎯",
    desc: "زايد على عدد الإجابات اللي تقدر تقولها. اللي يكسب المزاد يجاوب — ولو فشل يخسر نفس النقاط.",
    rules: [
      "اللعبة 5 جولات. كل جولة بنسحب موضوع وحرف.",
      "كل لاعب يزايد بعدد الإجابات اللي يقدر يقولها.",
      "1–10 إجابات = 10 نقط · 11–20 = 20 نقطة · 21+ = 30 نقطة.",
      "اللي يكسب المزاد يجاوب. لو نجح يكسب النقط، لو فشل يخسر نفس النقط.",
      "تقدر تستخدم كروت القوة على نفسك أو التلبيس على غيرك في أي وقت.",
    ],
  },
  {
    id: "survival", name: "البقاء للأسرع", subtitle: "3 ثواني بس", emoji: "⚡",
    desc: "دور سريع بين اللاعبين. اللي يتأخر أو يكرر إجابة يخرج. آخر واحد فايز.",
    rules: [
      "بنسحب موضوع واحد ويبدأ الدور يلف على اللاعبين.",
      "كل لاعب عنده 3 ثواني بس يقول إجابة جديدة.",
      "اللي يتأخر أو يكرر إجابة قيلت قبل كده — يخرج.",
      "آخر لاعب صامد يكسب 10 نقط.",
    ],
  },
  {
    id: "pingpong", name: "البينج بونج", subtitle: "وش لوش", emoji: "🏓",
    desc: "كل اتنين في مواجهة. ردة في 5 ثواني. الفائزين يكملوا لحد ما يتبقى بطل واحد.",
    rules: [
      "اللاعبين بيتقسموا أزواج بشكل عشوائي.",
      "كل زوج بياخد موضوع وبيتراشقوا إجابات (5 ثواني للرد).",
      "أول واحد يقف أو يكرر — يخسر المواجهة.",
      "الفايزين يكملوا لحد ما يفضل بطل واحد ياخد 10 نقط.",
    ],
  },
  {
    id: "hattrick", name: "هاتريك", subtitle: "3 مواضيع بحرف واحد", emoji: "🎩",
    desc: "اربط حرف واحد بـ 3 مواضيع في 10 ثواني. ضغط أعصاب مضاعف.",
    rules: [
      "كل دور بيطلع 3 مواضيع + حرف واحد.",
      "اللاعب لازم يقول إجابة لكل موضوع تبدأ بنفس الحرف، في 10 ثواني.",
      "لو قفل التلاتة يكمل، لو وقف في واحد منهم يخرج.",
      "آخر واحد صامد ياخد 10 نقط.",
    ],
  },
  {
    id: "chain", name: "السلسلة", subtitle: "آخر حرف = أول حرف", emoji: "🔗",
    desc: "كل لاعب يقول كلمة تبدأ بآخر حرف في الكلمة اللي قبله. 3 ثواني بس للتفكير.",
    rules: [
      "بنسحب موضوع واحد لكل الجولة.",
      "كل لاعب يقول كلمة تبدأ بآخر حرف من كلمة اللاعب اللي قبله.",
      "(الحروف ة، و، ء، ى بتتجاهل من آخر الكلمة)",
      "عندك 3 ثواني بس. اللي يقف أو يكرر — يخرج.",
      "آخر صامد ياخد 10 نقط.",
    ],
  },
];

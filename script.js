/*
  V2.0：版本收束与发布准备
  重点说明：
  1. 每日打卡记录仍然保存到 awei-checkin-YYYY-MM-DD。
  2. 每日数据兼容旧版 { tasks, summary }，新版统一保存 { tasks, emergencyTasks, summary }。
  3. 任务配置单独保存到 awei-task-config，不影响旧的每日记录。
  4. 突发任务计入今日完成率，但不计算剑士 / 学徒职业经验。
*/

const todayText = document.querySelector("#todayText");
const progressText = document.querySelector("#progressText");
const regularProgressText = document.querySelector("#regularProgressText");
const emergencyProgressText = document.querySelector("#emergencyProgressText");
const rateText = document.querySelector("#rateText");
const statusText = document.querySelector("#statusText");
const totalProgressBar = document.querySelector("#totalProgressBar");
const streakText = document.querySelector("#streakText");
const totalDaysText = document.querySelector("#totalDaysText");
const totalItemsText = document.querySelector("#totalItemsText");
const characterImage = document.querySelector("#characterImage");
const levelText = document.querySelector("#levelText");
const titleText = document.querySelector("#titleText");
const warriorLevelText = document.querySelector("#warriorLevelText");
const warriorTitleText = document.querySelector("#warriorTitleText");
const warriorExpText = document.querySelector("#warriorExpText");
const warriorProgressBar = document.querySelector("#warriorProgressBar");
const apprenticeLevelText = document.querySelector("#apprenticeLevelText");
const apprenticeTitleText = document.querySelector("#apprenticeTitleText");
const apprenticeExpText = document.querySelector("#apprenticeExpText");
const apprenticeProgressBar = document.querySelector("#apprenticeProgressBar");
const classBalanceText = document.querySelector("#classBalanceText");
const growthFeedbackText = document.querySelector("#growthFeedbackText");
const prevMonthButton = document.querySelector("#prevMonthButton");
const nextMonthButton = document.querySelector("#nextMonthButton");
const calendarMonthText = document.querySelector("#calendarMonthText");
const calendarGrid = document.querySelector("#calendarGrid");
const calendarDetail = document.querySelector("#calendarDetail");
const regularModules = document.querySelector("#regularModules");
const emergencyList = document.querySelector("#emergencyList");
const emergencyInput = document.querySelector("#emergencyInput");
const addEmergencyButton = document.querySelector("#addEmergencyButton");
const resetButton = document.querySelector("#resetButton");
const summaryInput = document.querySelector("#summaryInput");
const historyList = document.querySelector("#historyList");
const lastBackupText = document.querySelector("#lastBackupText");
const exportBackupButton = document.querySelector("#exportBackupButton");
const importBackupFile = document.querySelector("#importBackupFile");
const copyBackupButton = document.querySelector("#copyBackupButton");
const backupTextInput = document.querySelector("#backupTextInput");
const restoreBackupTextButton = document.querySelector("#restoreBackupTextButton");
const backupManualText = document.querySelector("#backupManualText");
const backupMessage = document.querySelector("#backupMessage");
const settlementButton = document.querySelector("#settlementButton");
const settlementModal = document.querySelector("#settlementModal");
const settlementContent = document.querySelector("#settlementContent");
const closeSettlementButton = document.querySelector("#closeSettlementButton");
const characterGallery = document.querySelector("#characterGallery");
const levelUpToast = document.querySelector("#levelUpToast");
const levelUpToastContent = document.querySelector("#levelUpToastContent");
const closeLevelUpToastButton = document.querySelector("#closeLevelUpToastButton");

const APP_ID = "awei-growth-adventure-log";
const APP_VERSION = "2.0";
const weekNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const storagePrefix = "awei-checkin-";
const taskConfigKey = "awei-task-config";
const lastBackupTimeKey = "awei-last-backup-time";
const TASK_CONFIG_VERSION = "1.5";
const emptyDailyData = { tasks: {}, emergencyTasks: [], summary: "" };
const titleSets = {
  overall: ["初入旅途者", "见习冒险者", "青藤冒险者", "森林行者", "成长探路者", "稳定修行者", "苍森守护者", "圣树远行者", "翠光领航者", "自驱传说者"],
  warrior: ["木剑新手", "见习剑士", "青藤剑士", "森林剑士", "疾风剑士", "守护剑士", "苍森骑士", "圣树剑豪", "翠光剑圣", "生命守护者"],
  apprentice: ["书页学徒", "见习学者", "青藤术士", "森林研究员", "智慧咏唱者", "星图解读者", "秘文导师", "圣树贤者", "翠光智者", "真理守望者"]
};
const characterStages = [
  { minLevel: 1, maxLevel: 10, name: "新手冒险者", description: "刚踏上修行旅途的起点，剑与书都还很轻。", image: "./assets/characters/stage-01-balanced.png" },
  { minLevel: 11, maxLevel: 20, name: "见习修行者", description: "开始适应每日修行，成长的微光已经点亮。", image: "./assets/characters/stage-02-balanced.png" },
  { minLevel: 21, maxLevel: 30, name: "青藤冒险者", description: "稳定的节奏让青藤纹章开始回应你的努力。", image: "./assets/characters/stage-03-balanced.png" },
  { minLevel: 31, maxLevel: 40, name: "森林行者", description: "已经走出新手期，能够独立穿行于成长之森。", image: "./assets/characters/stage-04-balanced.png" },
  { minLevel: 41, maxLevel: 50, name: "成长探路者", description: "剑与书逐渐形成平衡，前方的道路变得清晰。", image: "./assets/characters/stage-05-balanced.png" },
  { minLevel: 51, maxLevel: 60, name: "稳定修行者", description: "成长不再依赖一时热情，而是进入长期节奏。", image: "./assets/characters/stage-06-balanced.png" },
  { minLevel: 61, maxLevel: 70, name: "苍森守护者", description: "行动与智慧共同沉淀，守护自己的成长路径。", image: "./assets/characters/stage-07-balanced.png" },
  { minLevel: 71, maxLevel: 80, name: "圣树远行者", description: "高阶修行展开，远行的方向已经被点亮。", image: "./assets/characters/stage-08-balanced.png" },
  { minLevel: 81, maxLevel: 90, name: "翠光领航者", description: "你已经不只是前进者，也开始拥有引导自己的力量。", image: "./assets/characters/stage-09-balanced.png" },
  { minLevel: 91, maxLevel: 100, name: "自驱传说者", description: "长期自驱完成蜕变，剑与书共同抵达最终形态。", image: "./assets/characters/stage-10-balanced.png" }
];
const today = new Date();
let calendarDisplayDate = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedCalendarDateKey = formatDateKey(today);
let levelUpToastTimer = null;

// 默认任务配置：页面第一次打开时使用，也用于配置损坏时兜底。
// warriorExp / apprenticeExp 表示完成该任务时给哪个职业增加经验。
const defaultTaskConfig = {
  version: TASK_CONFIG_VERSION,
  modules: [
    {
      id: "fitness",
      title: "体能修炼",
      icon: "⚔️",
      description: "锻炼身体、作息与现实执行力。",
      defaultExpText: "完成每项：剑士 EXP +20",
      newTaskExp: { warriorExp: 20, apprenticeExp: 0 },
      tasks: [
        { id: "fitness-default-1", text: "坚持运动", warriorExp: 20, apprenticeExp: 0, isDefault: true, legacyIds: ["fitness-exercise"] },
        { id: "fitness-default-2", text: "控制饮食，每天喝水 2L 以上", warriorExp: 20, apprenticeExp: 0, isDefault: true, legacyIds: ["fitness-diet"] },
        { id: "fitness-default-3", text: "记录体重，保证 11 点前入睡", warriorExp: 20, apprenticeExp: 0, isDefault: true, legacyIds: ["fitness-weight"] }
      ]
    },
    {
      id: "spirit_wisdom",
      title: "灵智修行",
      icon: "📘",
      description: "通过 AI 学习、阅读、长内容输入和复盘沉淀心智。",
      defaultExpText: "新增任务默认：学徒 EXP +20",
      newTaskExp: { warriorExp: 0, apprenticeExp: 20 },
      tasks: [
        { id: "wisdom-default-1", text: "学习 AI", warriorExp: 0, apprenticeExp: 25, isDefault: true, legacyIds: ["ai-codex", "ai-practice", "ai-tool"] },
        { id: "mind-default-1", text: "阅读20分钟，浏览长视频30分钟", warriorExp: 0, apprenticeExp: 25, isDefault: true, legacyIds: ["reading-time", "reading-quote", "growth-video", "mind-default-2"] },
        { id: "mind-default-3", text: "睡前今日复盘 5 分钟", warriorExp: 10, apprenticeExp: 20, isDefault: true, legacyIds: ["growth-idea", "growth-reflection"] }
      ]
    }
  ]
};

// 旧版本数组数据的任务顺序。遇到旧数组时，按这个顺序尽量兼容读取。
const legacyTaskIds = [
  "fitness-default-1",
  "fitness-default-2",
  "fitness-default-3",
  "wisdom-default-1",
  "mind-default-1",
  "mind-default-2",
  "mind-default-3"
];

let taskConfig = loadTaskConfig();
let todayData = loadTodayData();

function formatDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function formatDisplayDate(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekNames[date.getDay()]}`;
}

function formatMonthText(date) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

function getStorageKey(dateKey) {
  return `${storagePrefix}${dateKey}`;
}

function cloneDefaultConfig() {
  return JSON.parse(JSON.stringify(defaultTaskConfig));
}

function cloneEmptyDailyData() {
  return JSON.parse(JSON.stringify(emptyDailyData));
}

// 把用户输入或 localStorage 中的文字转成普通文本，避免动态 innerHTML 被意外破坏。
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeExpValue(value, fallbackValue) {
  return Number.isFinite(value) ? value : fallbackValue;
}

function normalizeTask(task, fallbackModule, fallbackIndex) {
  if (!task || typeof task !== "object") return null;

  const id = typeof task.id === "string" && task.id.trim() !== "" ? task.id : `${fallbackModule.id}-recovered-${fallbackIndex}`;
  const defaultTask = fallbackModule.tasks.find(function (item) {
    return item.id === id;
  });
  const text = typeof task.text === "string" && task.text.trim() !== "" ? task.text : "未命名任务";
  const legacyIds = Array.isArray(task.legacyIds) ? task.legacyIds.filter(function (legacyId) {
    return typeof legacyId === "string" && legacyId.trim() !== "";
  }) : (defaultTask && Array.isArray(defaultTask.legacyIds) ? defaultTask.legacyIds : []);

  return {
    id,
    text,
    warriorExp: normalizeExpValue(task.warriorExp, defaultTask ? defaultTask.warriorExp : fallbackModule.newTaskExp.warriorExp),
    apprenticeExp: normalizeExpValue(task.apprenticeExp, defaultTask ? defaultTask.apprenticeExp : fallbackModule.newTaskExp.apprenticeExp),
    isDefault: task.isDefault === true,
    legacyIds
  };
}

function removeDuplicateTasks(tasks) {
  const seenIds = new Set();
  return tasks.filter(function (task) {
    if (!task || seenIds.has(task.id)) return false;
    seenIds.add(task.id);
    return true;
  });
}

// 统一校验任务配置，处理缺字段、重复任务、异常经验值等情况。
function sanitizeTaskConfig(config) {
  const safeConfig = cloneDefaultConfig();
  const incomingModules = config && Array.isArray(config.modules) ? config.modules : [];

  safeConfig.modules.forEach(function (safeModule) {
    const incomingModule = incomingModules.find(function (module) {
      return module && module.id === safeModule.id;
    });

    if (!incomingModule || !Array.isArray(incomingModule.tasks)) return;

    const normalizedTasks = incomingModule.tasks.map(function (task, index) {
      return normalizeTask(task, safeModule, index);
    }).filter(Boolean);

    safeModule.tasks = removeDuplicateTasks(normalizedTasks);
  });

  safeConfig.version = TASK_CONFIG_VERSION;
  return safeConfig;
}

// 读取用户自定义任务配置。异常时安全回到默认配置，避免页面报错。
function loadTaskConfig() {
  const savedText = localStorage.getItem(taskConfigKey);

  if (savedText === null) {
    return cloneDefaultConfig();
  }

  try {
    const savedConfig = JSON.parse(savedText);
    if (!savedConfig || !Array.isArray(savedConfig.modules)) {
      return cloneDefaultConfig();
    }
    if (savedConfig.version !== TASK_CONFIG_VERSION) {
      const migratedConfig = migrateTaskConfig(savedConfig);
      localStorage.setItem(taskConfigKey, JSON.stringify(migratedConfig));
      return migratedConfig;
    }
    const sanitizedConfig = sanitizeTaskConfig(savedConfig);
    localStorage.setItem(taskConfigKey, JSON.stringify(sanitizedConfig));
    return sanitizedConfig;
  } catch (error) {
    return cloneDefaultConfig();
  }
}

// 迁移旧版任务配置到当前任务结构。
// 目标只保留 fitness 和 spirit_wisdom 两个常规模块。
// 旧 wisdom / mind / knowledge / knowledge_mind 的任务会尽量合并到 spirit_wisdom。
function migrateTaskConfig(oldConfig) {
  const nextConfig = cloneDefaultConfig();
  const oldModules = Array.isArray(oldConfig.modules) ? oldConfig.modules : [];
  const fitnessModule = nextConfig.modules.find(function (module) {
    return module.id === "fitness";
  });
  const spiritModule = nextConfig.modules.find(function (module) {
    return module.id === "spirit_wisdom";
  });

  oldModules.forEach(function (oldModule) {
    if (!oldModule || !Array.isArray(oldModule.tasks)) return;

    if (oldModule.id === "fitness") {
      fitnessModule.tasks = [];
      mergeTasksById(fitnessModule, oldModule.tasks);
      return;
    }

    if (["wisdom", "mind", "knowledge", "knowledge_mind", "spirit_wisdom"].includes(oldModule.id)) {
      if (!spiritModule.hasMigratedOldTasks) {
        spiritModule.tasks = [];
        spiritModule.hasMigratedOldTasks = true;
      }
      mergeTasksById(spiritModule, oldModule.tasks);
    }
  });

  nextConfig.version = TASK_CONFIG_VERSION;
  delete spiritModule.hasMigratedOldTasks;
  const mergedReadingTask = spiritModule.tasks.find(function (task) {
    return task.id === "mind-default-1";
  });

  if (mergedReadingTask) {
    mergedReadingTask.text = "阅读20分钟，浏览长视频30分钟";
    mergedReadingTask.warriorExp = 0;
    mergedReadingTask.apprenticeExp = 25;
    mergedReadingTask.legacyIds = ["reading-time", "reading-quote", "growth-video", "mind-default-2"];
  }

  return sanitizeTaskConfig(nextConfig);
}

function mergeTasksById(targetModule, incomingTasks) {
  incomingTasks.forEach(function (incomingTask) {
    if (!incomingTask || !incomingTask.id) return;

    // 旧“看长视频 30 分钟”并入“阅读20分钟，浏览长视频30分钟”，避免重复任务。
    if (incomingTask.id === "mind-default-2") return;

    const existingTask = targetModule.tasks.find(function (task) {
      return task.id === incomingTask.id;
    });

    if (existingTask) {
      existingTask.text = incomingTask.text || existingTask.text;
      existingTask.warriorExp = Number.isFinite(incomingTask.warriorExp) ? incomingTask.warriorExp : existingTask.warriorExp;
      existingTask.apprenticeExp = Number.isFinite(incomingTask.apprenticeExp) ? incomingTask.apprenticeExp : existingTask.apprenticeExp;
      existingTask.isDefault = existingTask.isDefault === true;
      return;
    }

    targetModule.tasks.push({
      id: incomingTask.id,
      text: incomingTask.text || "未命名任务",
      warriorExp: Number.isFinite(incomingTask.warriorExp) ? incomingTask.warriorExp : targetModule.newTaskExp.warriorExp,
      apprenticeExp: Number.isFinite(incomingTask.apprenticeExp) ? incomingTask.apprenticeExp : targetModule.newTaskExp.apprenticeExp,
      isDefault: incomingTask.isDefault === true,
      legacyIds: Array.isArray(incomingTask.legacyIds) ? incomingTask.legacyIds : []
    });
  });
}

// 保存用户自定义任务配置，例如新增、删除和排序后的任务。
function saveTaskConfig() {
  taskConfig = sanitizeTaskConfig(taskConfig);
  localStorage.setItem(taskConfigKey, JSON.stringify(taskConfig));
}

function getAllRegularTasks() {
  return taskConfig.modules.flatMap(function (module) {
    return module.tasks;
  });
}

function getRegularTaskTotal() {
  return getAllRegularTasks().length;
}

function loadDataByDate(dateKey) {
  const savedText = localStorage.getItem(getStorageKey(dateKey));

  if (savedText === null) {
    return null;
  }

  try {
    return normalizeDailyData(JSON.parse(savedText));
  } catch (error) {
    return null;
  }
}

function loadDataByStorageKey(storageKey) {
  const savedText = localStorage.getItem(storageKey);

  if (savedText === null) {
    return null;
  }

  try {
    return normalizeDailyData(JSON.parse(savedText));
  } catch (error) {
    return null;
  }
}

function normalizeTaskStateMap(tasks) {
  if (Array.isArray(tasks)) {
    return tasks.map(function (value) {
      return value === true;
    });
  }

  if (!tasks || typeof tasks !== "object") {
    return {};
  }

  const normalizedTasks = {};
  Object.keys(tasks).forEach(function (taskId) {
    if (typeof taskId === "string" && taskId.trim() !== "") {
      normalizedTasks[taskId] = tasks[taskId] === true;
    }
  });
  return normalizedTasks;
}

function normalizeEmergencyTasks(emergencyTasks) {
  if (!Array.isArray(emergencyTasks)) return [];

  return emergencyTasks.map(function (task, index) {
    if (!task || typeof task !== "object") return null;
    const text = typeof task.text === "string" ? task.text.trim() : "";
    if (text === "") return null;
    return {
      id: typeof task.id === "string" && task.id.trim() !== "" ? task.id : `emergency-recovered-${index}`,
      text,
      completed: task.completed === true
    };
  }).filter(Boolean);
}

// 兼容旧数据：旧数据可能只有 { tasks, summary }，没有 emergencyTasks。
// 任何异常结构都会被转成稳定的新结构，避免页面读取时报错。
function normalizeDailyData(data) {
  if (!data || typeof data !== "object") {
    return cloneEmptyDailyData();
  }

  return {
    tasks: normalizeTaskStateMap(data.tasks),
    emergencyTasks: normalizeEmergencyTasks(data.emergencyTasks),
    summary: typeof data.summary === "string" ? data.summary : ""
  };
}

function loadTodayData() {
  const savedData = loadDataByDate(formatDateKey(today));

  if (savedData === null) {
    return cloneEmptyDailyData();
  }

  return savedData;
}

// 按 taskId 保存每日勾选状态。任务排序或删除不会改变其他任务的勾选状态。
function saveTodayData() {
  todayData = normalizeDailyData(todayData);
  localStorage.setItem(getStorageKey(formatDateKey(today)), JSON.stringify(todayData));
}

function isTaskDone(tasks, taskId, legacyIds = []) {
  if (Array.isArray(tasks)) {
    const compatibleIds = [taskId].concat(legacyIds);
    return compatibleIds.some(function (compatibleId) {
      const legacyIndex = legacyTaskIds.indexOf(compatibleId);
      return legacyIndex >= 0 && tasks[legacyIndex] === true;
    });
  }

  if (tasks && typeof tasks === "object") {
    return tasks[taskId] === true || legacyIds.some(function (legacyId) {
      return tasks[legacyId] === true;
    });
  }

  return false;
}

function setTaskDone(taskId, checked) {
  if (!todayData.tasks || Array.isArray(todayData.tasks)) {
    todayData.tasks = {};
  }
  todayData.tasks[taskId] = checked;
}

function countRegularFinished(tasks) {
  let finishedCount = 0;
  getAllRegularTasks().forEach(function (task) {
    if (isTaskDone(tasks, task.id, task.legacyIds || [])) {
      finishedCount = finishedCount + 1;
    }
  });
  return finishedCount;
}

function countEmergencyFinished(emergencyTasks) {
  if (!Array.isArray(emergencyTasks)) return 0;

  return emergencyTasks.filter(function (task) {
    return task.completed === true;
  }).length;
}

function getDayStats(data) {
  if (data === null) {
    return {
      regularFinished: 0,
      regularTotal: getRegularTaskTotal(),
      emergencyFinished: 0,
      emergencyTotal: 0,
      totalFinished: 0,
      totalTasks: getRegularTaskTotal(),
      rate: 0
    };
  }

  const regularFinished = countRegularFinished(data.tasks || {});
  const regularTotal = getRegularTaskTotal();
  const emergencyTasks = Array.isArray(data.emergencyTasks) ? data.emergencyTasks : [];
  const emergencyFinished = countEmergencyFinished(emergencyTasks);
  const emergencyTotal = emergencyTasks.length;
  const totalFinished = regularFinished + emergencyFinished;
  const totalTasks = regularTotal + emergencyTotal;

  return {
    regularFinished,
    regularTotal,
    emergencyFinished,
    emergencyTotal,
    totalFinished,
    totalTasks,
    rate: calculateRate(totalFinished, totalTasks)
  };
}

function calculateRate(finishedCount, totalCount) {
  if (totalCount === 0) {
    return 0;
  }
  return Math.round((finishedCount / totalCount) * 100);
}

function getStatusText(rate) {
  if (rate === 0) return "今日的冒险还未启程，先完成一个小任务吧。";
  if (rate < 40) return "少年冒险者已经踏出第一步，继续积攒今日经验吧。";
  if (rate < 80) return "今日修行节奏稳定，剑与书都在回应你的努力。";
  if (rate < 100) return "距离今日满额修行只差一步，最后的任务正在等待你。";
  return "今日任务全部完成，冒险者状态已达到最佳。";
}

function isSuccessfulCheckinDay(data) {
  return data !== null && getDayStats(data).totalFinished > 0;
}

// 只有常规任务计算职业经验，突发任务不计算职业经验。
function calculateExpFromTasks(tasks) {
  let warriorExp = 0;
  let apprenticeExp = 0;

  getAllRegularTasks().forEach(function (task) {
    if (isTaskDone(tasks, task.id, task.legacyIds || [])) {
      warriorExp = warriorExp + (task.warriorExp || 0);
      apprenticeExp = apprenticeExp + (task.apprenticeExp || 0);
    }
  });

  return { warriorExp, apprenticeExp };
}

function renderRegularModules() {
  regularModules.innerHTML = "";

  taskConfig.modules.forEach(function (module) {
    const article = document.createElement("article");
    article.className = "card";
    article.dataset.moduleCard = "";
    article.dataset.moduleId = module.id;

    const titleRow = document.createElement("div");
    titleRow.className = "section-title-row";
    titleRow.innerHTML = `
      <div>
        <h2><span aria-hidden="true">${escapeHtml(module.icon)}</span> ${escapeHtml(module.title)}</h2>
        <p class="module-desc">${escapeHtml(module.description)}</p>
        <p class="exp-hint">${escapeHtml(module.defaultExpText)}</p>
      </div>
      <span class="module-progress" data-module-progress>0 / ${module.tasks.length}</span>
    `;

    const progressTrack = document.createElement("div");
    progressTrack.className = "progress-track progress-track-small";
    progressTrack.setAttribute("aria-hidden", "true");
    progressTrack.innerHTML = `<div class="progress-fill module-progress-fill" data-module-bar></div>`;

    const taskList = document.createElement("div");
    taskList.className = "task-list";

    module.tasks.forEach(function (task, index) {
      taskList.appendChild(createRegularTaskElement(module.id, task, index, module.tasks.length));
    });

    const addRow = document.createElement("div");
    addRow.className = "add-task-row";
    addRow.innerHTML = `
      <input type="text" placeholder="添加新的${escapeHtml(module.title)}任务" data-add-input="${escapeHtml(module.id)}">
      <button type="button" class="small-button" data-add-module="${escapeHtml(module.id)}">添加任务</button>
    `;

    article.append(titleRow, progressTrack, taskList, addRow);
    regularModules.appendChild(article);
  });

  bindRegularTaskEvents();
}

function createRegularTaskElement(moduleId, task, index, totalTasks) {
  const row = document.createElement("div");
  row.className = "task-row";
  row.dataset.taskId = task.id;
  row.innerHTML = `
    <label class="check-item">
      <input type="checkbox" data-regular-task-id="${escapeHtml(task.id)}" ${isTaskDone(todayData.tasks, task.id, task.legacyIds || []) ? "checked" : ""}>
      <span>${escapeHtml(task.text)}</span>
    </label>
    <div class="task-actions">
      <button type="button" class="mini-button" data-move-task="${escapeHtml(task.id)}" data-module-id="${escapeHtml(moduleId)}" data-direction="up" ${index === 0 ? "disabled" : ""}>↑</button>
      <button type="button" class="mini-button" data-move-task="${escapeHtml(task.id)}" data-module-id="${escapeHtml(moduleId)}" data-direction="down" ${index === totalTasks - 1 ? "disabled" : ""}>↓</button>
      <button type="button" class="mini-button danger-mini" data-delete-task="${escapeHtml(task.id)}" data-module-id="${escapeHtml(moduleId)}">删除</button>
    </div>
  `;
  return row;
}

function bindRegularTaskEvents() {
  document.querySelectorAll("[data-regular-task-id]").forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      withLevelUpCheck(function () {
        setTaskDone(checkbox.dataset.regularTaskId, checkbox.checked);
        saveTodayData();
        updateAll();
      });
    });
  });

  document.querySelectorAll("[data-move-task]").forEach(function (button) {
    button.addEventListener("click", function () {
      moveRegularTask(button.dataset.moduleId, button.dataset.moveTask, button.dataset.direction);
    });
  });

  document.querySelectorAll("[data-delete-task]").forEach(function (button) {
    button.addEventListener("click", function () {
      deleteRegularTask(button.dataset.moduleId, button.dataset.deleteTask);
    });
  });

  document.querySelectorAll("[data-add-module]").forEach(function (button) {
    button.addEventListener("click", function () {
      addRegularTask(button.dataset.addModule);
    });
  });
}

// 添加常规任务：新增到哪个模块，就按哪个模块的默认经验规则计算。
function addRegularTask(moduleId) {
  withLevelUpCheck(function () {
    const module = taskConfig.modules.find(function (item) {
      return item.id === moduleId;
    });
    const input = document.querySelector(`[data-add-input="${moduleId}"]`);

    if (!module || !input) return;

    const text = input.value.trim();

    if (text === "") return;

    module.tasks.push({
      id: `${moduleId}-custom-${Date.now()}`,
      text,
      warriorExp: module.newTaskExp.warriorExp,
      apprenticeExp: module.newTaskExp.apprenticeExp,
      isDefault: false
    });

    input.value = "";
    saveTaskConfig();
    renderRegularModules();
    updateAll();
  });
}

// 当前版本不提供编辑功能：用户如需改文字，可以删除旧任务后添加新任务。
// 这样避免 prompt 编辑在不同浏览器环境里不稳定，也让任务系统更轻。

// 任务排序保存在 awei-task-config 中。
// 排序只移动当前模块内 tasks 数组的位置，不改变 taskId，因此不会清空当天勾选状态。
function moveRegularTask(moduleId, taskId, direction) {
  const module = taskConfig.modules.find(function (item) {
    return item.id === moduleId;
  });

  if (!module) return;

  const currentIndex = module.tasks.findIndex(function (task) {
    return task.id === taskId;
  });

  if (currentIndex < 0) return;

  const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (nextIndex < 0 || nextIndex >= module.tasks.length) return;

  const movedTask = module.tasks[currentIndex];
  module.tasks[currentIndex] = module.tasks[nextIndex];
  module.tasks[nextIndex] = movedTask;
  saveTaskConfig();
  renderRegularModules();
  updateAll();
}

// 删除任务：默认任务和用户新增任务都可以删除。
// 删除前会确认；历史记录中找不到配置的 taskId 会在统计时自然跳过。
function deleteRegularTask(moduleId, taskId) {
  withLevelUpCheck(function () {
    const module = taskConfig.modules.find(function (item) {
      return item.id === moduleId;
    });

    if (!module) return;

    const task = module.tasks.find(function (item) {
      return item.id === taskId;
    });

    if (!task) return;

    const confirmed = confirm(`确定要删除任务「${task.text}」吗？`);

    if (!confirmed) return;

    module.tasks = module.tasks.filter(function (task) {
      return task.id !== taskId;
    });

    if (todayData.tasks && typeof todayData.tasks === "object" && !Array.isArray(todayData.tasks)) {
      delete todayData.tasks[taskId];
      saveTodayData();
    }

    saveTaskConfig();
    renderRegularModules();
    updateAll();
  });
}

function renderEmergencyTasks() {
  emergencyList.innerHTML = "";

  if (todayData.emergencyTasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-text";
    empty.textContent = "今天还没有突发任务。";
    emergencyList.appendChild(empty);
    return;
  }

  todayData.emergencyTasks.forEach(function (task) {
    const row = document.createElement("div");
    row.className = "task-row emergency-task-row";
    row.innerHTML = `
      <label class="check-item">
        <input type="checkbox" data-emergency-id="${escapeHtml(task.id)}" ${task.completed ? "checked" : ""}>
        <span>${escapeHtml(task.text)}</span>
      </label>
      <div class="task-actions">
        <button type="button" class="mini-button danger-mini" data-delete-emergency="${escapeHtml(task.id)}">删除</button>
      </div>
    `;
    emergencyList.appendChild(row);
  });

  document.querySelectorAll("[data-emergency-id]").forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      const task = todayData.emergencyTasks.find(function (item) {
        return item.id === checkbox.dataset.emergencyId;
      });
      if (!task) return;
      task.completed = checkbox.checked;
      saveTodayData();
      updateAll();
    });
  });

  document.querySelectorAll("[data-delete-emergency]").forEach(function (button) {
    button.addEventListener("click", function () {
      deleteEmergencyTask(button.dataset.deleteEmergency);
    });
  });
}

// 添加突发任务：按日期保存在今天的 emergencyTasks 中，不增加职业经验。
function addEmergencyTask() {
  const text = emergencyInput.value.trim();
  if (text === "") return;

  todayData.emergencyTasks.push({
    id: `emergency-${Date.now()}`,
    text,
    completed: false
  });

  emergencyInput.value = "";
  saveTodayData();
  renderEmergencyTasks();
  updateAll();
}

function deleteEmergencyTask(taskId) {
  todayData.emergencyTasks = todayData.emergencyTasks.filter(function (task) {
    return task.id !== taskId;
  });
  saveTodayData();
  renderEmergencyTasks();
  updateAll();
}

function updateOverview() {
  const stats = getDayStats(todayData);

  progressText.textContent = `${stats.totalFinished} / ${stats.totalTasks}`;
  regularProgressText.textContent = `${stats.regularFinished} / ${stats.regularTotal}`;
  emergencyProgressText.textContent = `${stats.emergencyFinished} / ${stats.emergencyTotal}`;
  rateText.textContent = `${stats.rate}%`;
  statusText.textContent = getStatusText(stats.rate);
  totalProgressBar.style.width = `${stats.rate}%`;
  updateSettlementButton(stats);
}

function updateModuleProgress() {
  document.querySelectorAll("[data-module-card]").forEach(function (card) {
    const module = taskConfig.modules.find(function (item) {
      return item.id === card.dataset.moduleId;
    });
    const progressText = card.querySelector("[data-module-progress]");
    const progressBar = card.querySelector("[data-module-bar]");
    let finished = 0;

    if (!module || !progressText || !progressBar) return;

    module.tasks.forEach(function (task) {
      if (isTaskDone(todayData.tasks, task.id, task.legacyIds || [])) finished = finished + 1;
    });

    progressText.textContent = `${finished} / ${module.tasks.length}`;
    progressBar.style.width = `${calculateRate(finished, module.tasks.length)}%`;
  });
}

function getRecentSevenDateKeys() {
  const dateKeys = [];
  for (let i = 0; i < 7; i = i + 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dateKeys.push(formatDateKey(date));
  }
  return dateKeys;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function isShowingCurrentMonth() {
  return calendarDisplayDate.getFullYear() === today.getFullYear() && calendarDisplayDate.getMonth() === today.getMonth();
}

function isSelectedDateInDisplayedMonth() {
  const selectedDate = new Date(`${selectedCalendarDateKey}T00:00:00`);
  return selectedDate.getFullYear() === calendarDisplayDate.getFullYear() && selectedDate.getMonth() === calendarDisplayDate.getMonth();
}

function getCalendarStatus(finishedCount, totalCount, hasRecord) {
  const rate = calculateRate(finishedCount, totalCount);
  if (!hasRecord || finishedCount === 0) return { className: "status-none", label: "未打卡", rate };
  if (rate < 40) return { className: "status-light", label: "轻度打卡", rate };
  if (rate < 80) return { className: "status-steady", label: "稳定打卡", rate };
  if (rate < 100) return { className: "status-high", label: "高完成度", rate };
  return { className: "status-complete", label: "全部完成", rate };
}

function renderCalendarDetail(dateKey) {
  const savedData = loadDataByDate(dateKey);

  if (savedData === null) {
    calendarDetail.textContent = `${dateKey}\n该日期暂无冒险记录。`;
    return;
  }

  const stats = getDayStats(savedData);
  const summary = savedData.summary || "暂无冒险日志";
  calendarDetail.textContent = `${dateKey}\n常规任务完成：${stats.regularFinished} / ${stats.regularTotal}\n突发任务完成：${stats.emergencyFinished} / ${stats.emergencyTotal}\n总完成率：${stats.rate}%\n冒险日志：${summary}`;
}

function renderCalendar() {
  const year = calendarDisplayDate.getFullYear();
  const month = calendarDisplayDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  calendarMonthText.textContent = formatMonthText(calendarDisplayDate);
  calendarGrid.innerHTML = "";

  for (let i = 0; i < firstDay; i = i + 1) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-empty";
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day = day + 1) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    const savedData = loadDataByDate(dateKey);
    const stats = getDayStats(savedData);
    const hasRecord = savedData !== null;
    const status = getCalendarStatus(stats.totalFinished, stats.totalTasks, hasRecord);
    const dayButton = document.createElement("button");

    dayButton.type = "button";
    dayButton.className = `calendar-day ${status.className}`;
    dayButton.dataset.dateKey = dateKey;
    dayButton.setAttribute("aria-label", `${dateKey} ${status.label}`);
    if (isShowingCurrentMonth() && dateKey === formatDateKey(today)) dayButton.classList.add("is-today");
    if (dateKey === selectedCalendarDateKey) dayButton.classList.add("is-selected");
    dayButton.innerHTML = `<span class="calendar-day-number">${day}</span><span class="calendar-day-result">${hasRecord ? `完成 ${stats.totalFinished} / ${stats.totalTasks}` : "暂无"}</span>`;
    dayButton.addEventListener("click", function () {
      selectedCalendarDateKey = dateKey;
      renderCalendar();
      renderCalendarDetail(dateKey);
    });
    calendarGrid.appendChild(dayButton);
  }

  if (isSelectedDateInDisplayedMonth()) renderCalendarDetail(selectedCalendarDateKey);
  else calendarDetail.textContent = "请选择一个日期查看详情。";
}

function changeCalendarMonth(step) {
  calendarDisplayDate = new Date(calendarDisplayDate.getFullYear(), calendarDisplayDate.getMonth() + step, 1);
  selectedCalendarDateKey = formatDateKey(calendarDisplayDate);
  renderCalendar();
}

// 遍历 localStorage：只处理 awei-checkin- 开头的每日记录。
// 格式异常或 JSON 解析失败的记录会被跳过。
function getAllProjectRecords() {
  const records = [];
  for (let i = 0; i < localStorage.length; i = i + 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(storagePrefix)) continue;
    const dateKey = key.slice(storagePrefix.length);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) continue;
    const data = loadDataByStorageKey(key);
    if (data === null) continue;
    records.push({ dateKey, tasks: data.tasks || {}, emergencyTasks: data.emergencyTasks || [] });
  }
  return records;
}

function calculateStreakDays() {
  let streakDays = 0;
  for (let i = 0; i < 3660; i = i + 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const savedData = loadDataByDate(formatDateKey(date));
    if (!isSuccessfulCheckinDay(savedData)) break;
    streakDays = streakDays + 1;
  }
  return streakDays;
}

function calculateGrowthStats() {
  const records = getAllProjectRecords();
  let totalCheckinDays = 0;
  let totalFinishedItems = 0;
  let warriorExp = 0;
  let apprenticeExp = 0;

  records.forEach(function (record) {
    const stats = getDayStats(record);
    const exp = calculateExpFromTasks(record.tasks);
    if (stats.totalFinished > 0) totalCheckinDays = totalCheckinDays + 1;
    totalFinishedItems = totalFinishedItems + stats.totalFinished;
    warriorExp = warriorExp + exp.warriorExp;
    apprenticeExp = apprenticeExp + exp.apprenticeExp;
  });

  return { streakDays: calculateStreakDays(), totalCheckinDays, totalFinishedItems, warriorExp, apprenticeExp };
}

// Lv.n -> Lv.n+1 需要 n * 10 EXP。
// 因此 Lv.1 到 Lv.100 总共需要 10 * (1+2+...+99) = 49,500 EXP。
// 如果每天剑士和学徒各约 70 EXP，49,500 / 70 ≈ 707 天，接近两年满级。
function getExpNeededForNextLevel(level) {
  return level * 10;
}

function getTotalExpRequiredForLevel(level) {
  if (level <= 1) return 0;

  let totalExp = 0;

  for (let currentLevel = 1; currentLevel < level; currentLevel = currentLevel + 1) {
    totalExp = totalExp + getExpNeededForNextLevel(currentLevel);
  }

  return totalExp;
}

function getLevelFromExp(totalExp) {
  let level = 1;

  while (level < 100 && totalExp >= getTotalExpRequiredForLevel(level + 1)) {
    level = level + 1;
  }

  return level;
}

function getCurrentLevelProgress(totalExp) {
  const level = getLevelFromExp(totalExp);

  if (level >= 100) {
    return {
      level,
      currentExp: 100,
      neededExp: 100,
      percent: 100,
      isMax: true
    };
  }

  const levelStartExp = getTotalExpRequiredForLevel(level);
  const neededExp = getExpNeededForNextLevel(level);
  const currentExp = totalExp - levelStartExp;

  return {
    level,
    currentExp,
    neededExp,
    percent: calculateRate(currentExp, neededExp),
    isMax: false
  };
}

function getTitleByLevel(level, type) {
  const safeLevel = Math.min(Math.max(Number(level) || 1, 1), 100);
  const titleIndex = Math.min(Math.floor((safeLevel - 1) / 10), 9);
  const titles = titleSets[type] || titleSets.overall;
  return titles[titleIndex] || titles[0];
}

// 根据综合等级切换角色立绘。
// 顶部角色状态面板和成长图鉴共用 characterStages，避免维护两套图片路径。
function getCharacterImageByLevel(level) {
  const safeLevel = Math.min(Math.max(Number(level) || 1, 1), 100);
  const stage = getCharacterStages()[getCurrentStageIndex(safeLevel)];
  return stage ? stage.image : getCharacterStages()[0].image;
}

function getCharacterStages() {
  return characterStages;
}

function getCurrentStageIndex(compositeLevel) {
  const safeLevel = Math.min(Math.max(Number(compositeLevel) || 1, 1), 100);
  return Math.min(Math.floor((safeLevel - 1) / 10), getCharacterStages().length - 1);
}

function getUnlockedStageIndex(compositeLevel) {
  return getCurrentStageIndex(compositeLevel);
}

function getStageIndexByLevel(level) {
  return getCurrentStageIndex(level);
}

function getStageNameByIndex(index) {
  const stage = getCharacterStages()[index];
  return stage ? stage.name : "";
}

function getCurrentLevelSnapshot() {
  const stats = calculateGrowthStats();
  const warriorLevel = getCurrentLevelProgress(stats.warriorExp).level;
  const apprenticeLevel = getCurrentLevelProgress(stats.apprenticeExp).level;
  const compositeLevel = calculateOverallLevel(warriorLevel, apprenticeLevel);

  return {
    warriorLevel,
    apprenticeLevel,
    compositeLevel,
    stageIndex: getStageIndexByLevel(compositeLevel)
  };
}

function compareLevelSnapshots(before, after) {
  const upgrades = [];

  if (after.warriorLevel > before.warriorLevel) {
    upgrades.push({ type: "warrior", label: "⚔️ 剑士", from: before.warriorLevel, to: after.warriorLevel });
  }

  if (after.apprenticeLevel > before.apprenticeLevel) {
    upgrades.push({ type: "apprentice", label: "📘 学徒", from: before.apprenticeLevel, to: after.apprenticeLevel });
  }

  if (after.compositeLevel > before.compositeLevel) {
    upgrades.push({ type: "composite", label: "🌿 综合", from: before.compositeLevel, to: after.compositeLevel });
  }

  return {
    upgrades,
    stageUnlocked: after.stageIndex > before.stageIndex,
    unlockedStageName: after.stageIndex > before.stageIndex ? getStageNameByIndex(after.stageIndex) : ""
  };
}

function getLevelUpMessage(upgradeInfo) {
  if (upgradeInfo.upgrades.length > 1) return "剑与书都见证了这次成长。";
  if (upgradeInfo.stageUnlocked) return "新的成长形态已被点亮。";

  const firstUpgrade = upgradeInfo.upgrades[0];
  if (!firstUpgrade) return "";
  if (firstUpgrade.type === "warrior") return "剑锋回应了你的行动。";
  if (firstUpgrade.type === "apprentice") return "书页记录了新的理解。";
  return "你的冒险者形态正在发生变化。";
}

function showLevelUpToast(upgradeInfo) {
  if (!levelUpToast || !levelUpToastContent || upgradeInfo.upgrades.length === 0) return;

  const upgradeLines = upgradeInfo.upgrades.map(function (upgrade) {
    return `<li>${escapeHtml(upgrade.label)} Lv.${upgrade.from} → Lv.${upgrade.to}</li>`;
  }).join("");
  const stageLine = upgradeInfo.stageUnlocked ? `<p class="level-up-stage">新的成长形态已解锁：${escapeHtml(upgradeInfo.unlockedStageName)}</p>` : "";

  levelUpToastContent.innerHTML = `
    <strong>Level Up！</strong>
    <ul>${upgradeLines}</ul>
    ${stageLine}
    <p>${escapeHtml(getLevelUpMessage(upgradeInfo))}</p>
  `;

  levelUpToast.classList.add("is-visible");
  levelUpToast.setAttribute("aria-hidden", "false");

  window.clearTimeout(levelUpToastTimer);
  levelUpToastTimer = window.setTimeout(function () {
    closeLevelUpToast();
  }, 4200);
}

function closeLevelUpToast() {
  if (!levelUpToast) return;
  window.clearTimeout(levelUpToastTimer);
  levelUpToast.classList.remove("is-visible");
  levelUpToast.setAttribute("aria-hidden", "true");
}

function triggerLevelUpEffects(upgradeInfo) {
  if (!upgradeInfo || upgradeInfo.upgrades.length === 0) return;

  [warriorProgressBar, apprenticeProgressBar, totalProgressBar].forEach(function (bar) {
    bar.classList.remove("level-up-flash");
    window.requestAnimationFrame(function () {
      bar.classList.add("level-up-flash");
    });
  });

  const portrait = characterImage.closest(".character-portrait");
  if (portrait) {
    portrait.classList.remove("level-up-glow");
    window.requestAnimationFrame(function () {
      portrait.classList.add("level-up-glow");
    });
  }
}

function withLevelUpCheck(callback) {
  const before = getCurrentLevelSnapshot();
  callback();
  const after = getCurrentLevelSnapshot();
  const upgradeInfo = compareLevelSnapshots(before, after);

  if (upgradeInfo.upgrades.length > 0) {
    showLevelUpToast(upgradeInfo);
    triggerLevelUpEffects(upgradeInfo);
  }
}

function calculateOverallLevel(warriorLevel, apprenticeLevel) {
  return Math.floor((warriorLevel + apprenticeLevel) / 2);
}

function getClassBalanceText(warriorLevel, apprenticeLevel) {
  if (warriorLevel - apprenticeLevel >= 5) return "你的剑术修行明显领先，别忘了翻开书页，让智慧跟上剑锋。";
  if (apprenticeLevel - warriorLevel >= 5) return "你的学徒修行更加出色，也该让身体跟上头脑的成长。";
  return "剑与书正在同步成长，你正走在稳定的双修路线中。";
}

function getGrowthFeedback(streakDays) {
  if (streakDays === 0) return "冒险日志还在等待第一页，今天可以从一个小任务开始。";
  if (streakDays <= 2) return "修行之路已经点亮，别让刚燃起的微光熄灭。";
  if (streakDays <= 6) return "连续修行的节奏正在成形，你的冒险者气息更稳定了。";
  if (streakDays <= 13) return "你已经完成一周级别的修行，公会会记住这种坚持。";
  return "这已经不是偶然的努力，而是属于你的成长轨迹。";
}

function updateClassPanel(levelElement, titleElement, expElement, barElement, iconName, progress, title) {
  const expText = progress.isMax ? "EXP MAX" : `EXP ${progress.currentExp} / ${progress.neededExp}`;

  levelElement.textContent = `${iconName} Lv.${progress.level}`;
  titleElement.textContent = title;
  expElement.textContent = expText;
  barElement.style.width = `${progress.percent}%`;
}

function updateGrowthOverview() {
  const stats = calculateGrowthStats();
  const warriorProgress = getCurrentLevelProgress(stats.warriorExp);
  const apprenticeProgress = getCurrentLevelProgress(stats.apprenticeExp);
  const warriorLevel = warriorProgress.level;
  const apprenticeLevel = apprenticeProgress.level;
  const overallLevel = calculateOverallLevel(warriorLevel, apprenticeLevel);

  streakText.textContent = `${stats.streakDays} 天`;
  totalDaysText.textContent = `累计修行：${stats.totalCheckinDays} 天`;
  totalItemsText.textContent = `累计修行项目：${stats.totalFinishedItems} 项`;
  levelText.textContent = `Lv.${overallLevel} ${getTitleByLevel(overallLevel, "overall")}`;
  characterImage.src = getCharacterImageByLevel(overallLevel);
  characterImage.closest(".character-portrait").classList.remove("image-error");
  titleText.textContent = "";
  classBalanceText.textContent = getClassBalanceText(warriorLevel, apprenticeLevel);
  growthFeedbackText.textContent = getGrowthFeedback(stats.streakDays);
  updateClassPanel(warriorLevelText, warriorTitleText, warriorExpText, warriorProgressBar, "⚔️ 剑士", warriorProgress, getTitleByLevel(warriorLevel, "warrior"));
  updateClassPanel(apprenticeLevelText, apprenticeTitleText, apprenticeExpText, apprenticeProgressBar, "📘 学徒", apprenticeProgress, getTitleByLevel(apprenticeLevel, "apprentice"));
}

// 横向近 7 日记录：用 flex + overflow-x 生成可滑动日志卡片。
function renderHistory() {
  historyList.innerHTML = "";
  getRecentSevenDateKeys().forEach(function (dateKey) {
    const savedData = loadDataByDate(dateKey);
    const stats = getDayStats(savedData);
    const card = document.createElement("li");
    card.className = "history-card-item";

    if (savedData === null) {
      card.innerHTML = `<strong>${dateKey}</strong><span>暂无记录</span><span>冒险未启程</span>`;
    } else {
      const status = stats.rate === 100 ? "全部完成" : stats.rate >= 60 ? "稳定修行" : stats.rate > 0 ? "已启程" : "未打卡";
      card.innerHTML = `<strong>${dateKey}</strong><span>完成 ${stats.totalFinished} / ${stats.totalTasks}</span><span>完成率 ${stats.rate}%</span><span>${status}</span>`;
    }
    historyList.appendChild(card);
  });
}

function getCurrentOverallLevel() {
  const stats = calculateGrowthStats();
  const warriorLevel = getCurrentLevelProgress(stats.warriorExp).level;
  const apprenticeLevel = getCurrentLevelProgress(stats.apprenticeExp).level;
  return calculateOverallLevel(warriorLevel, apprenticeLevel);
}

function handleGalleryImageError(image) {
  const imageBox = image.closest(".gallery-image-box");
  if (!imageBox) return;
  image.remove();
  imageBox.classList.add("image-error");
  imageBox.textContent = "角色图待补全";
}

function renderCharacterGallery() {
  if (!characterGallery) return;

  const compositeLevel = getCurrentOverallLevel();
  const unlockedStageIndex = getUnlockedStageIndex(compositeLevel);
  const currentStageIndex = getCurrentStageIndex(compositeLevel);

  characterGallery.innerHTML = "";

  getCharacterStages().forEach(function (stage, index) {
    const isUnlocked = index <= unlockedStageIndex;
    const isCurrent = index === currentStageIndex;
    const card = document.createElement("article");

    card.className = `gallery-stage-card${isUnlocked ? " is-unlocked" : " is-locked"}${isCurrent ? " is-current" : ""}`;
    card.innerHTML = `
      <div class="gallery-image-box">
        <img src="${escapeHtml(stage.image)}" alt="${escapeHtml(stage.name)}角色图">
        ${isUnlocked ? "" : `<span class="gallery-lock">未解锁</span>`}
      </div>
      <div class="gallery-stage-info">
        <span class="gallery-level">Lv.${stage.minLevel} - ${stage.maxLevel}</span>
        <h3>${escapeHtml(stage.name)}</h3>
        <strong>${isCurrent ? "当前阶段" : isUnlocked ? "已解锁" : `达到 Lv.${stage.minLevel} 后解锁`}</strong>
        <p>${escapeHtml(stage.description)}</p>
      </div>
    `;

    const image = card.querySelector("img");
    image.addEventListener("error", function () {
      handleGalleryImageError(image);
    });

    characterGallery.appendChild(card);
  });
}

function bindGalleryToggle() {
  // details 元素自带展开/收起能力；这里保留函数入口，后续需要保存展开状态时可在这里扩展。
  renderCharacterGallery();
}

function getTodayStats() {
  const stats = getDayStats(todayData);

  return {
    totalCompleted: stats.totalFinished,
    totalCount: stats.totalTasks,
    regularCompleted: stats.regularFinished,
    regularCount: stats.regularTotal,
    emergencyCompleted: stats.emergencyFinished,
    emergencyCount: stats.emergencyTotal,
    completionRate: stats.rate
  };
}

// 今日结算只计算今天常规任务提供的职业经验；突发任务只进完成率，不进 EXP。
function calculateTodayExp() {
  return calculateExpFromTasks(todayData.tasks || {});
}

function getSettlementRank(rate) {
  if (rate === 0) return { key: "none", label: "未启程", badge: "未启程" };
  if (rate < 40) return { key: "c", label: "C 级修行", badge: "C" };
  if (rate < 70) return { key: "b", label: "B 级修行", badge: "B" };
  if (rate < 100) return { key: "a", label: "A 级修行", badge: "A" };
  return { key: "s", label: "S 级修行", badge: "S" };
}

function getSettlementMessage(rankKey) {
  const messages = {
    none: "今天的冒险日志还没有写下第一笔。明天，可以从一个小任务开始。",
    c: "你已经踏出了今天的第一步。微小的经验，也会成为角色成长的底色。",
    b: "今天的修行已经形成节奏。剑锋和书页，都留下了你的痕迹。",
    a: "优秀的修行成果。你的冒险者状态正在稳定上升。",
    s: "今日任务全部达成。剑与书一同发光，这是属于你的满额修行日。"
  };

  return messages[rankKey] || messages.none;
}

function renderSettlementModal() {
  if (!settlementContent) return;

  const stats = getTodayStats();
  const todayExp = calculateTodayExp();
  const rank = getSettlementRank(stats.completionRate);
  const summary = todayData.summary && todayData.summary.trim() !== "" ? todayData.summary.trim() : "尚未记录。";

  settlementContent.innerHTML = `
    <div class="settlement-header">
      <h2 id="settlementTitle">今日修行结算</h2>
      <p>剑与书记录了今天的成长。</p>
    </div>
    <div class="settlement-body">
      <div class="settlement-rank rank-${rank.key}">
        <div>
          <strong>${escapeHtml(rank.badge)}</strong>
          <span>${escapeHtml(rank.label)}</span>
        </div>
      </div>
      <div class="settlement-grid">
        <div class="settlement-stat"><span>今日任务</span><strong>${stats.totalCompleted} / ${stats.totalCount}</strong></div>
        <div class="settlement-stat"><span>今日完成率</span><strong>${stats.completionRate}%</strong></div>
        <div class="settlement-stat"><span>常规任务</span><strong>${stats.regularCompleted} / ${stats.regularCount}</strong></div>
        <div class="settlement-stat"><span>突发任务</span><strong>${stats.emergencyCompleted} / ${stats.emergencyCount}</strong></div>
        <div class="settlement-exp"><span>剑士 EXP</span><strong>+${todayExp.warriorExp}</strong></div>
        <div class="settlement-exp"><span>学徒 EXP</span><strong>+${todayExp.apprenticeExp}</strong></div>
        <p class="settlement-message">${escapeHtml(getSettlementMessage(rank.key))}</p>
        <p class="settlement-log"><strong>今日日志：</strong>${escapeHtml(summary)}</p>
      </div>
    </div>
  `;
}

function openSettlementModal() {
  if (!settlementModal || !closeSettlementButton) return;

  renderSettlementModal();
  settlementModal.classList.add("is-open");
  settlementModal.setAttribute("aria-hidden", "false");
  closeSettlementButton.focus();
}

function closeSettlementModal() {
  if (!settlementModal) return;

  settlementModal.classList.remove("is-open");
  settlementModal.setAttribute("aria-hidden", "true");
}

function bindSettlementEvents() {
  if (!settlementButton || !settlementModal || !closeSettlementButton) return;

  settlementButton.addEventListener("click", openSettlementModal);
  closeSettlementButton.addEventListener("click", closeSettlementModal);
  settlementModal.querySelectorAll("[data-close-settlement]").forEach(function (element) {
    element.addEventListener("click", closeSettlementModal);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && settlementModal.classList.contains("is-open")) {
      closeSettlementModal();
    }
  });
}

function updateSettlementButton(stats) {
  if (!settlementButton) return;

  const isPerfect = stats.rate === 100 && stats.totalTasks > 0;
  settlementButton.classList.toggle("is-perfect", isPerfect);
  settlementButton.textContent = isPerfect ? "领取满额修行结算" : "领取今日修行结算";
}

function setBackupMessage(message, isError = false) {
  if (!backupMessage) return;
  backupMessage.textContent = message;
  backupMessage.classList.toggle("is-error", isError);
}

function formatBackupDisplayTime(isoText) {
  if (!isoText) return "暂无";

  const date = new Date(isoText);
  if (Number.isNaN(date.getTime())) return "暂无";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

// 收集所有本项目 localStorage 数据：只导出 awei- 开头的 key，避免带走无关网站数据。
function collectBackupData() {
  const data = {};

  for (let i = 0; i < localStorage.length; i = i + 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("awei-")) continue;
    data[key] = localStorage.getItem(key);
  }

  return data;
}

// 生成完整备份对象。data 里保留 localStorage 的原始字符串，导入时可直接恢复。
function createBackupPayload() {
  return {
    app: APP_ID,
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    data: collectBackupData()
  };
}

function createBackupJsonText() {
  return JSON.stringify(createBackupPayload(), null, 2);
}

// 最近备份时间单独保存在 awei-last-backup-time，便于页面下次打开时显示。
function updateLastBackupTime() {
  localStorage.setItem(lastBackupTimeKey, new Date().toISOString());
  renderLastBackupTime();
}

function renderLastBackupTime() {
  if (!lastBackupText) return;
  lastBackupText.textContent = `最近备份：${formatBackupDisplayTime(localStorage.getItem(lastBackupTimeKey))}`;
}

function getBackupFileName() {
  return `awei-growth-backup-${formatDateKey(today)}.json`;
}

// 使用 Blob + URL.createObjectURL 下载 JSON，不需要服务器。
function downloadBackupFile() {
  const backupText = createBackupJsonText();
  const blob = new Blob([backupText], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = getBackupFileName();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  updateLastBackupTime();
  if (backupManualText) backupManualText.classList.remove("is-visible");
  setBackupMessage("备份文件已生成并开始下载。");
}

// 复制备份文本；如果浏览器不支持剪贴板 API，就显示 textarea 让用户手动复制。
async function copyBackupText() {
  const backupText = createBackupJsonText();

  if (backupManualText) backupManualText.value = backupText;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(backupText);
      if (backupManualText) backupManualText.classList.remove("is-visible");
      updateLastBackupTime();
      setBackupMessage("备份文本已复制，可以保存到 Obsidian 或其他地方。");
      return;
    } catch (error) {
      // 继续走手动复制兜底。
    }
  }

  if (backupManualText) {
    backupManualText.classList.add("is-visible");
    backupManualText.focus();
    backupManualText.select();
  }
  updateLastBackupTime();
  setBackupMessage("当前浏览器无法自动复制，请手动复制下方备份文本。");
}

// 校验备份格式：必须是本项目 app，且 data 是对象。
function validateBackupPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { valid: false, message: "备份内容不是有效对象。" };
  }

  if (payload.app !== APP_ID) {
    return { valid: false, message: "备份文件不属于阿尾成长冒险日志。" };
  }

  if (!payload.data || typeof payload.data !== "object" || Array.isArray(payload.data)) {
    return { valid: false, message: "备份文件缺少 data 数据。" };
  }

  const projectKeys = Object.keys(payload.data).filter(function (key) {
    return key.startsWith("awei-");
  });

  if (projectKeys.length === 0) {
    return { valid: false, message: "备份里没有可恢复的 awei- 项目数据。" };
  }

  return { valid: true, message: "" };
}

// 导入备份只覆盖备份里包含的 awei- key，不清空整个 localStorage。
function importBackupPayload(payload) {
  const validation = validateBackupPayload(payload);

  if (!validation.valid) {
    setBackupMessage(validation.message, true);
    return false;
  }

  const confirmed = confirm("导入备份会覆盖当前本地同名数据，是否继续？");
  if (!confirmed) return false;

  withLevelUpCheck(function () {
    Object.keys(payload.data).forEach(function (key) {
      if (!key.startsWith("awei-")) return;
      localStorage.setItem(key, String(payload.data[key]));
    });

    updateLastBackupTime();
    reloadStateFromStorage();
  });

  setBackupMessage("备份已恢复完成。");
  return true;
}

function parseBackupText(text) {
  try {
    return { payload: JSON.parse(text), message: "" };
  } catch (error) {
    return { payload: null, message: "JSON 格式不正确，请检查备份文本。" };
  }
}

function handleBackupFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.addEventListener("load", function () {
    const result = parseBackupText(String(reader.result || ""));
    if (!result.payload) {
      setBackupMessage(result.message, true);
      if (importBackupFile) importBackupFile.value = "";
      return;
    }

    importBackupPayload(result.payload);
    if (importBackupFile) importBackupFile.value = "";
  });

  reader.addEventListener("error", function () {
    setBackupMessage("读取备份文件失败，请重新选择文件。", true);
    if (importBackupFile) importBackupFile.value = "";
  });

  reader.readAsText(file);
}

function restoreBackupFromText() {
  if (!backupTextInput) return;
  const text = backupTextInput.value.trim();
  if (text === "") {
    setBackupMessage("请先粘贴备份 JSON 文本。", true);
    return;
  }

  const result = parseBackupText(text);
  if (!result.payload) {
    setBackupMessage(result.message, true);
    return;
  }

  if (importBackupPayload(result.payload)) {
    backupTextInput.value = "";
  }
}

function reloadStateFromStorage() {
  taskConfig = loadTaskConfig();
  todayData = loadTodayData();
  summaryInput.value = todayData.summary;
  renderRegularModules();
  renderEmergencyTasks();
  updateAll();
  renderLastBackupTime();
}

function updateAll() {
  updateOverview();
  updateModuleProgress();
  updateGrowthOverview();
  renderCalendar();
  renderHistory();
  renderCharacterGallery();
}

summaryInput.addEventListener("input", function () {
  todayData.summary = summaryInput.value;
  saveTodayData();
  renderCalendar();
});

addEmergencyButton.addEventListener("click", addEmergencyTask);
emergencyInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") addEmergencyTask();
});

prevMonthButton.addEventListener("click", function () {
  changeCalendarMonth(-1);
});

nextMonthButton.addEventListener("click", function () {
  changeCalendarMonth(1);
});

if (exportBackupButton) exportBackupButton.addEventListener("click", downloadBackupFile);
if (importBackupFile) importBackupFile.addEventListener("change", handleBackupFileImport);
if (copyBackupButton) copyBackupButton.addEventListener("click", copyBackupText);
if (restoreBackupTextButton) restoreBackupTextButton.addEventListener("click", restoreBackupFromText);
if (closeLevelUpToastButton) closeLevelUpToastButton.addEventListener("click", closeLevelUpToast);

characterImage.addEventListener("error", function () {
  characterImage.closest(".character-portrait").classList.add("image-error");
});

resetButton.addEventListener("click", function () {
  const isConfirmed = confirm("确定要重置今天的所有打卡状态吗？");
  if (!isConfirmed) return;

  todayData = { tasks: {}, emergencyTasks: [], summary: "" };
  summaryInput.value = "";
  localStorage.removeItem(getStorageKey(formatDateKey(today)));
  renderRegularModules();
  renderEmergencyTasks();
  updateAll();
});

// 注册 Service Worker：部署到 GitHub Pages 的 https 地址后可提供基础离线能力。
// 如果在本地文件模式或不支持 Service Worker 的环境中失败，只输出警告，不影响页面功能。
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./service-worker.js")
      .then(function () {
        console.log("Service Worker registered");
      })
      .catch(function (error) {
        console.warn("Service Worker registration failed:", error);
      });
  });
}

todayText.textContent = formatDisplayDate(today);
summaryInput.value = todayData.summary;
renderLastBackupTime();
bindSettlementEvents();
bindGalleryToggle();
renderRegularModules();
renderEmergencyTasks();
updateAll();

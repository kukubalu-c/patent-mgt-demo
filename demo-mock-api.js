/**
 * demo-mock-api.js
 * 作用：模拟后端 API，纯前端演示用
 * 说明：在 src/js/api.js 之前加载，预先注入 window.patentAPI
 *       api.js 检测到 patentAPI 已存在则跳过自己的定义。
 * 数据：所有数据在内存中，刷新页面后重置
 */

(function () {
    // ============================================
    // 1. 模拟数据集
    // ============================================
    const NOW = new Date();
    const Y = NOW.getFullYear();
    const M = NOW.getMonth(); // 0-based
    const D = NOW.getDate();
    function dateStr(y, m, d) { return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
    function daysAgo(n) { const d = new Date(NOW); d.setDate(d.getDate() - n); return dateStr(d.getFullYear(), d.getMonth(), d.getDate()); }
    function daysLater(n) { const d = new Date(NOW); d.setDate(d.getDate() + n); return dateStr(d.getFullYear(), d.getMonth(), d.getDate()); }
    function monthsAgo(n) { const d = new Date(NOW); d.setMonth(d.getMonth() - n); return dateStr(d.getFullYear(), d.getMonth(), d.getDate()); }
    function nowStr() { return dateStr(Y, M, D); }

    // 模拟专利数据 —— 12条，覆盖多种状态和类型
    const mockPatents = [
        { id:1, patent_no:'202010123456.7', patent_name:'一种基于深度学习的图像识别方法', patent_type:'发明', inventor:'张强,李尚', applicant:'某科技有限公司', apply_date:'2020-03-15', authorize_date:'2024-06-20', status:'专利权生效', fee_reduction:'小微企业', notes:'核心专利', is_deleted:0, deleted_at:null, created_at:'2020-03-15 09:00:00', updated_at:'2024-06-20 14:00:00' },
        { id:2, patent_no:'202110234567.8', patent_name:'一种智能垃圾分类装置', patent_type:'实用新型', inventor:'王明', applicant:'某环保科技公司', apply_date:'2021-07-22', authorize_date:'2022-01-15', status:'专利权生效', fee_reduction:'个人', notes:'', is_deleted:0, deleted_at:null, created_at:'2021-07-22 10:00:00', updated_at:'2022-01-15 09:00:00' },
        { id:3, patent_no:'202210345678.9', patent_name:'智能手表（圆形表盘）', patent_type:'外观设计', inventor:'赵丽', applicant:'某穿戴设备公司', apply_date:'2022-01-10', authorize_date:'2022-08-20', status:'专利权生效', fee_reduction:'无', notes:'畅销产品外观', is_deleted:0, deleted_at:null, created_at:'2022-01-10 08:00:00', updated_at:'2022-08-20 16:00:00' },
        { id:4, patent_no:'202210456789.0', patent_name:'一种区块链数据存储方法及系统', patent_type:'发明', inventor:'陈伟,刘洋,张强', applicant:'某区块链技术公司', apply_date:'2022-05-18', authorize_date:null, status:'实质审查中', fee_reduction:'普通企业', notes:'已进入实审', is_deleted:0, deleted_at:null, created_at:'2022-05-18 09:30:00', updated_at:'2023-11-10 11:00:00' },
        { id:5, patent_no:'202310567890.1', patent_name:'一种自动化农业灌溉系统', patent_type:'实用新型', inventor:'刘洋', applicant:'某农业科技公司', apply_date:'2023-02-28', authorize_date:'2023-08-15', status:'专利权生效', fee_reduction:'小微企业', notes:'', is_deleted:0, deleted_at:null, created_at:'2023-02-28 14:00:00', updated_at:'2023-08-15 10:00:00' },
        { id:6, patent_no:'202310678901.2', patent_name:'基于AI的语音助手交互方法', patent_type:'发明', inventor:'李尚,王明', applicant:'某人工智能公司', apply_date:'2023-06-01', authorize_date:null, status:'OA答复中', fee_reduction:'普通企业', notes:'答复审查意见中', is_deleted:0, deleted_at:null, created_at:'2023-06-01 11:00:00', updated_at:'2024-02-20 15:00:00' },
        { id:7, patent_no:'202410789012.3', patent_name:'一种新型可折叠电子设备', patent_type:'发明', inventor:'张强', applicant:'某通信技术公司', apply_date:'2024-01-05', authorize_date:null, status:'已申请', fee_reduction:'无', notes:'2024年重点专利', is_deleted:0, deleted_at:null, created_at:'2024-01-05 16:00:00', updated_at:'2024-01-05 16:00:00' },
        { id:8, patent_no:'202410890123.4', patent_name:'一种环保型包装材料', patent_type:'实用新型', inventor:'赵丽,陈伟', applicant:'某包装材料公司', apply_date:'2024-04-20', authorize_date:null, status:'形式审查中', fee_reduction:'小微企业', notes:'', is_deleted:0, deleted_at:null, created_at:'2024-04-20 09:00:00', updated_at:'2024-04-20 09:00:00' },
        { id:9, patent_no:'202410901234.5', patent_name:'智能水杯', patent_type:'外观设计', inventor:'刘洋', applicant:'某家居用品公司', apply_date:'2024-06-15', authorize_date:null, status:'已申请', fee_reduction:'个人', notes:'', is_deleted:0, deleted_at:null, created_at:'2024-06-15 10:30:00', updated_at:'2024-06-15 10:30:00' },
        { id:10,patent_no:'202510012345.6', patent_name:'一种量子计算优化方法', patent_type:'发明', inventor:'王明,张强,李尚', applicant:'某量子科技公司', apply_date:'2025-01-20', authorize_date:null, status:'撰写中', fee_reduction:'普通企业', notes:'预研项目', is_deleted:0, deleted_at:null, created_at:'2025-01-20 08:00:00', updated_at:'2025-01-20 08:00:00' },
        { id:11,patent_no:'202010123457.8', patent_name:'一种数据处理算法（已驳回）', patent_type:'发明', inventor:'陈伟', applicant:'某软件公司', apply_date:'2020-08-10', authorize_date:null, status:'已驳回', fee_reduction:'无', notes:'驳回待申诉', is_deleted:0, deleted_at:null, created_at:'2020-08-10 13:00:00', updated_at:'2023-05-30 10:00:00' },
        { id:12,patent_no:'201910234568.9', patent_name:'一种旧式机械结构（已终止）', patent_type:'实用新型', inventor:'赵丽', applicant:'某机械公司', apply_date:'2019-11-05', authorize_date:'2020-05-20', status:'已终止', fee_reduction:'个人', notes:'年费未缴已终止', is_deleted:0, deleted_at:null, created_at:'2019-11-05 15:00:00', updated_at:'2023-12-01 09:00:00' },
    ];

    // 费用任务 —— 生成约30条，覆盖逾期/临期/正常/已缴费
    function genFeeTasks() {
        const tasks = [];
        let id = 100;
        // 各专利的费用
        const feeDefs = [
            // patentId, feeType, yearIndex, dueDate, amount, status, paidDate
            [1, '年费', 1, daysLater(-30), 135, '待缴费', null],       // 逾期
            [1, '年费', 2, daysLater(60), 135, '待缴费', null],        // 临期
            [1, '年费', 3, daysLater(200), 135, '待缴费', null],       // 正常
            [1, '年费', 4, daysLater(400), 135, '待缴费', null],
            [1, '年费', 5, daysAgo(30), 180, '已缴费', daysAgo(35)],   // 已缴费
            [2, '年费', 1, daysAgo(15), 90, '待缴费', null],           // 逾期
            [2, '年费', 2, daysLater(90), 90, '待缴费', null],         // 临期
            [2, '年费', 3, daysLater(300), 90, '待缴费', null],
            [2, '年费', 4, daysLater(500), 135, '待缴费', null],
            [3, '年费', 1, daysAgo(5), 600, '待缴费', null],           // 逾期
            [3, '年费', 2, daysLater(120), 600, '待缴费', null],
            [3, '年费', 3, daysLater(280), 600, '待缴费', null],
            [4, '申请费', null, daysLater(45), 270, '待缴费', null],    // 临期
            [4, '公布印刷费', null, daysLater(45), 50, '待缴费', null],
            [4, '实质审查费', null, daysLater(700), 2500, '待缴费', null],
            [5, '年费', 1, daysAgo(60), 90, '已缴费', daysAgo(65)],
            [5, '年费', 2, daysLater(120), 90, '待缴费', null],
            [6, '申请费', null, daysLater(20), 270, '待缴费', null],    // 临期
            [6, '公布印刷费', null, daysLater(20), 50, '待缴费', null],
            [7, '申请费', null, daysLater(10), 900, '待缴费', null],    // 临期
            [7, '公布印刷费', null, daysLater(10), 50, '待缴费', null],
            [8, '申请费', null, daysAgo(60), 75, '已缴费', daysAgo(65)],
            [8, '公布印刷费', null, daysAgo(60), 0, '已缴费', daysAgo(65)],
            [9, '申请费', null, daysLater(35), 75, '待缴费', null],
            [9, '公布印刷费', null, daysLater(35), 0, '待缴费', null],
            [11, '申请费', null, daysAgo(500), 900, '已失效', null],
            [11, '公布印刷费', null, daysAgo(500), 50, '已失效', null],
        ];
        feeDefs.forEach(f => {
            tasks.push({ id:id++, patent_id:f[0], fee_type:f[1], year_index:f[2], due_date:f[3], amount:f[4], status:f[5], paid_date:f[6], paid_amount:f[5]==='已缴费'?f[4]:0, penalty_rate:0, paid_year:null, created_at:daysAgo(30) });
        });
        return tasks;
    }

    const mockFeeTasks = genFeeTasks();

    // 状态流转映射（同 seed_data.js）
    const mockStatusTransitions = [
        { id:1,  current_status:'撰写中', action:'提交申请/上传请求书', attachment_required:0, attachment_type:'', next_status:'已申请', fee_type:'申请费,公布印刷费', fee_due_rule:'申请日+2个月' },
        { id:2,  current_status:'已申请', action:'上传《专利申请受理通知书》', attachment_required:1, attachment_type:'专利申请受理通知书', next_status:'形式审查中', fee_type:'', fee_due_rule:'' },
        { id:3,  current_status:'形式审查中', action:'初审合格（系统过N天或手动触发）', attachment_required:0, attachment_type:'', next_status:'待实质审查', fee_type:'实质审查费（仅发明）', fee_due_rule:'申请日满2.5年起提醒' },
        { id:4,  current_status:'形式审查中', action:'初审合格', attachment_required:0, attachment_type:'', next_status:'通知授权', fee_type:'授权登记费', fee_due_rule:'授权发文日+2个月' },
        { id:5,  current_status:'待实质审查', action:'上传《发明专利申请进入实质审查阶段通知书》', attachment_required:1, attachment_type:'进入实质审查阶段通知书', next_status:'实质审查中', fee_type:'', fee_due_rule:'' },
        { id:6,  current_status:'实质审查中', action:'下载/上传《审查意见通知书》(OA)', attachment_required:1, attachment_type:'审查意见通知书', next_status:'OA答复中', fee_type:'', fee_due_rule:'' },
        { id:7,  current_status:'OA答复中', action:'上传《意见陈述书》及修改后权利要求书', attachment_required:1, attachment_type:'意见陈述书及权利要求书', next_status:'实质审查中', fee_type:'', fee_due_rule:'' },
        { id:8,  current_status:'OA答复中', action:'上传《授予发明专利权通知书》', attachment_required:1, attachment_type:'授予发明专利权通知书', next_status:'通知授权', fee_type:'授权登记费', fee_due_rule:'授权发文日+2个月' },
        { id:9,  current_status:'通知授权', action:'缴纳授权登记费', attachment_required:0, attachment_type:'', next_status:'专利权生效', fee_type:'授权登记费', fee_due_rule:'缴费后自动生成首年年费' },
        { id:10, current_status:'专利权生效', action:'年费逾期30天未缴', attachment_required:0, attachment_type:'', next_status:'已终止', fee_type:'', fee_due_rule:'' },
        { id:11, current_status:'实质审查中', action:'上传《驳回决定》', attachment_required:1, attachment_type:'驳回决定', next_status:'已驳回', fee_type:'', fee_due_rule:'' },
        { id:12, current_status:'任一', action:'手动标记"主动撤回"并上传撤回声明', attachment_required:1, attachment_type:'撤回声明', next_status:'已撤回', fee_type:'', fee_due_rule:'' },
    ];

    // 附件
    const mockAttachments = [
        { id:1, patent_id:1, file_name:'受理通知书.pdf', file_path:'uploads/1/受理通知书.pdf', file_type:'专利申请受理通知书', uploaded_at:daysAgo(200) },
        { id:2, patent_id:1, file_name:'授权证书.jpg', file_path:'uploads/1/授权证书.jpg', file_type:'授予专利权通知书', uploaded_at:daysAgo(100) },
        { id:3, patent_id:4, file_name:'进入实审通知书.pdf', file_path:'uploads/4/进入实审通知书.pdf', file_type:'进入实质审查阶段通知书', uploaded_at:daysAgo(150) },
        { id:4, patent_id:6, file_name:'审查意见通知书.pdf', file_path:'uploads/6/审查意见通知书.pdf', file_type:'审查意见通知书', uploaded_at:daysAgo(60) },
        { id:5, patent_id:6, file_name:'意见陈述书.pdf', file_path:'uploads/6/意见陈述书.pdf', file_type:'意见陈述书及权利要求书', uploaded_at:daysAgo(30) },
    ];

    // 操作日志
    const mockOperationLogs = [
        { id:1,  patent_id:1, action_type:'创建',  description:'专利录入系统', operator:'系统', created_at:'2020-03-15 09:00:00' },
        { id:2,  patent_id:1, action_type:'状态变更', description:'状态从"已申请"变更为"形式审查中"', operator:'系统', created_at:'2020-04-20 10:00:00' },
        { id:3,  patent_id:1, action_type:'任务生成', description:'状态变更为"已申请"，自动生成了申请费和公布印刷费任务', operator:'系统', created_at:'2020-03-15 09:00:00' },
        { id:4,  patent_id:1, action_type:'缴费',  description:'缴纳第1年年费', operator:'系统', created_at:'2021-03-10 14:00:00' },
        { id:5,  patent_id:1, action_type:'状态变更', description:'状态变更为"专利权生效"', operator:'系统', created_at:'2024-06-20 14:00:00' },
        { id:6,  patent_id:2, action_type:'创建',  description:'专利录入系统', operator:'系统', created_at:'2021-07-22 10:00:00' },
        { id:7,  patent_id:4, action_type:'创建',  description:'专利录入系统', operator:'系统', created_at:'2022-05-18 09:30:00' },
        { id:8,  patent_id:4, action_type:'状态变更', description:'状态从"待实质审查"变更为"实质审查中"', operator:'系统', created_at:'2023-11-10 11:00:00' },
        { id:9,  patent_id:6, action_type:'状态变更', description:'状态从"实质审查中"变更为"OA答复中"', operator:'系统', created_at:'2024-02-20 15:00:00' },
        { id:10, patent_id:11, action_type:'状态变更', description:'状态从"实质审查中"变更为"已驳回"', operator:'系统', created_at:'2023-05-30 10:00:00' },
    ];

    // settings
    const mockSettings = {
        'seed_imported': '1',
        'app_password': 'demo-hash',  // 密码已设置
        'security_question': '您的大学名称是什么？',
        'security_answer': 'demo-answer-hash',
    };

    // 数据库计数器
    let nextId = { patents: 100, feeTasks: 500, attachments: 100, logs: 500, pendingTasks: 100 };

    // 当前"已登录"状态（用于 checkPasswordSet）
    let passwordSet = true;

    // ============================================
    // 2. SQL 查询模式匹配（关键词路由）
    // ============================================

    // ---- 2a. 通用工具 ----
    function getWhereCondition(sql) {
        const idx = sql.toUpperCase().indexOf('WHERE');
        if (idx === -1) return '';
        // 截取 WHERE 到 ORDER BY / LIMIT / GROUP BY / 结尾
        let rest = sql.substring(idx + 5);
        rest = rest.replace(/\bORDER\s+BY\b.*/i, '');
        rest = rest.replace(/\bLIMIT\b.*/i, '');
        rest = rest.replace(/\bGROUP\s+BY\b.*/i, '');
        return rest.trim();
    }

    function hasInCondition(where) {
        return /IN\s*\(/.test(where);
    }

    function extractIdsFromIn(where) {
        // 提取 "patent_id IN (?,?,?)" 或 "id IN (?,?)" 中的 ? 数量
        const m = where.match(/IN\s*\(([^)]+)\)/);
        if (!m) return null;
        const count = m[1].split(',').filter(s => s.trim() === '?').length;
        return count;
    }

    // ---- 2b. 查询路由器 ----
    function mockDbQuery(sql, params) {
        const s = sql.trim();
        const upper = s.toUpperCase();
        params = params || [];

        // === 调试：记录未处理查询 ===
        // console.log('dbQuery:', s.substring(0,120), params);

        // ============ SETTINGS 表查询 ============
        if (/FROM\s+settings/i.test(s)) {
            return handleSettingsQuery(s, params);
        }

        // ============ SUM 聚合查询（不含 GROUP BY，如费用总计）============
        if (/SUM\s*\(/i.test(s) && !/GROUP\s+BY/i.test(s)) {
            return handleSumQuery(s, params);
        }

        // ============ 聚合 / GROUP BY 查询 ============
        if (/GROUP\s+BY/i.test(s)) {
            return handleGroupByQuery(s, params);
        }

        // ============ COUNT 查询 ============
        if (/COUNT\s*\(\*\)/i.test(s) || /COUNT\s*\(/i.test(s)) {
            return handleCountQuery(s, params);
        }

        // ============ fee_tasks (含 JOIN) ============
        if (/FROM\s+fee_tasks/i.test(s) && /JOIN/i.test(s)) {
            return handleFeeDetailQuery(s, params);
        }

        // ============ 按表名路由 ============
        if (/FROM\s+patents/i.test(s)) return handlePatentSelect(s, params);
        if (/FROM\s+fee_tasks/i.test(s)) return handleFeeTaskSelect(s, params);
        if (/FROM\s+status_transitions/i.test(s)) return handleTransitionSelect(s, params);
        if (/FROM\s+attachments/i.test(s)) return handleAttachmentSelect(s, params);
        if (/FROM\s+pending_urgent_tasks/i.test(s)) return handlePendingTaskSelect(s, params);
        if (/FROM\s+fee_standards/i.test(s)) return []; // 前端有硬编码标准
        if (/FROM\s+fee_reduction_rates/i.test(s)) return [];
        if (/FROM\s+penalty_rates/i.test(s)) return [];
        if (/FROM\s+fee_due_rules/i.test(s)) return [];
        if (/FROM\s+operation_logs/i.test(s)) return handleLogSelect(s, params);

        console.warn('[Demo Mock] 未匹配的查询:', s.substring(0,100));
        return [];
    }

    // ---- 2c. 各表查询处理器 ----

    // 设置表
    function handleSettingsQuery(sql, params) {
        const m = sql.match(/key\s*=\s*['"]([^'"]+)['"]/);
        if (m) {
            const key = m[1];
            const val = mockSettings[key];
            return val !== undefined ? [{ key: key, value: val }] : [];
        }
        // 参数化查询: key = ?
        if (sql.includes('key = ?') && params.length > 0) {
            const val = mockSettings[params[0]];
            return val !== undefined ? [{ key: params[0], value: val }] : [];
        }
        return [];
    }

    // COUNT 查询
    function handleCountQuery(sql, params) {
        // 检查表名
        if (/FROM\s+patents/i.test(sql)) {
            const pts = filterPatents(sql, params);
            return [{ cnt: pts.length }];
        }
        if (/FROM\s+fee_tasks/i.test(sql)) {
            const now = new Date();
            const today = dateStr(now.getFullYear(), now.getMonth(), now.getDate());
            const tasks = filterFeeTasks(sql, params);
            // 如果条件中有 date('now','localtime')，模拟为 today
            if (/due_date\s*<\s*date/i.test(sql) || /due_date\s*<\s*date/i.test(sql)) {
                const overdue = tasks.filter(t => t.due_date < today);
                return [{ cnt: overdue.length }];
            }
            // 如果条件中有 strftime('%Y-%m', due_date) = strftime('%Y-%m', ...)
            if (/strftime/i.test(sql)) {
                const yearMonth = today.substring(0, 7);
                const monthly = tasks.filter(t => t.status === '待缴费' && t.due_date && t.due_date.startsWith(yearMonth));
                return [{ cnt: monthly.length }];
            }
            // 通用待缴费计数
            if (/status\s*=\s*['"]待缴费['"]/i.test(sql)) {
                return [{ cnt: tasks.filter(t => t.status === '待缴费').length }];
            }
            return [{ cnt: tasks.length }];
        }
        if (/FROM\s+pending_urgent_tasks/i.test(sql)) {
            return [{ cnt: 2 }];
        }
        return [{ cnt: 0 }];
    }

    // SUM 聚合查询（不含 GROUP BY，如费用总计）
    function handleSumQuery(sql, params) {
        // SELECT SUM(amount) as grand_total FROM fee_tasks WHERE ...
        if (/grand_total/i.test(sql) || /SUM\s*\(\s*amount\s*\)/i.test(sql)) {
            // 与预算汇总表一致：2340+1830+150+2500+650 = 7470
            return [{ grand_total: 7470 }];
        }
        return [{ grand_total: 0 }];
    }

    // GROUP BY 聚合查询
    function handleGroupByQuery(sql, params) {
        // 柱状图: GROUP BY patent_type, year
        if (/patent_type.*strftime.*year/i.test(sql)) {
            const currentYear = NOW.getFullYear();
            const years = parseInt(params[1] || params[0]) || (currentYear - 3);
            const startYear = typeof params[0] === 'string' ? parseInt(params[0]) : currentYear - 2;
            const endYear = typeof params[1] === 'string' ? parseInt(params[1]) : currentYear;
            // 返回模拟的年分布数据
            const results = [];
            if (startYear <= currentYear - 2) {
                results.push({ patent_type: '发明', year: String(currentYear - 2), total: 2, active: 1 });
                results.push({ patent_type: '实用新型', year: String(currentYear - 2), total: 3, active: 2 });
            }
            if (startYear <= currentYear - 1) {
                results.push({ patent_type: '发明', year: String(currentYear - 1), total: 1, active: 0 });
                results.push({ patent_type: '实用新型', year: String(currentYear - 1), total: 2, active: 1 });
                results.push({ patent_type: '外观设计', year: String(currentYear - 1), total: 1, active: 1 });
            }
            if (startYear <= currentYear) {
                results.push({ patent_type: '发明', year: String(currentYear), total: 2, active: 0 });
                results.push({ patent_type: '实用新型', year: String(currentYear), total: 1, active: 0 });
            }
            return results;
        }
        // 预算汇总: GROUP BY fee_type
        if (/fee_type.*SUM/i.test(sql)) {
            return [
                { fee_type: '申请费', total: 2340, count: 6 },
                { fee_type: '年费', total: 1830, count: 8 },
                { fee_type: '公布印刷费', total: 150, count: 5 },
                { fee_type: '实质审查费', total: 2500, count: 1 },
                { fee_type: '授权登记费', total: 650, count: 3 },
            ];
        }
        return [];
    }

    // 费用明细（含 JOIN）
    function handleFeeDetailQuery(sql, params) {
        // 按费用类型分组，与 handleGroupByQuery 汇总数据精确一致
        var feeDetailMap = {
            '申请费': [ // 6笔 ¥2,340
                { patent_no: '202410789012.3', patent_name: '一种新型可折叠电子设备', year_index: null, amount: 900, due_date: daysLater(10), status: '待缴费', paid_date: null },
                { patent_no: '202410890123.4', patent_name: '一种环保型包装材料', year_index: null, amount: 75, due_date: daysAgo(60), status: '已缴费', paid_date: daysAgo(65) },
                { patent_no: '202410901234.5', patent_name: '智能水杯', year_index: null, amount: 75, due_date: daysLater(35), status: '待缴费', paid_date: null },
                { patent_no: '202310678901.2', patent_name: '基于AI的语音助手交互方法', year_index: null, amount: 270, due_date: daysLater(20), status: '待缴费', paid_date: null },
                { patent_no: '202210456789.0', patent_name: '一种区块链数据存储方法及系统', year_index: null, amount: 270, due_date: daysLater(45), status: '待缴费', paid_date: null },
                { patent_no: '202010123457.8', patent_name: '一种数据处理算法（已驳回）', year_index: null, amount: 750, due_date: daysAgo(500), status: '已失效', paid_date: null },
            ],
            '年费': [ // 8笔 ¥1,830
                { patent_no: '202210345678.9', patent_name: '智能手表（圆形表盘）', year_index: 1, amount: 600, due_date: daysAgo(5), status: '待缴费', paid_date: null },
                { patent_no: '202210345678.9', patent_name: '智能手表（圆形表盘）', year_index: 2, amount: 600, due_date: daysLater(120), status: '待缴费', paid_date: null },
                { patent_no: '202010123456.7', patent_name: '一种基于深度学习的图像识别方法', year_index: 1, amount: 135, due_date: daysLater(-30), status: '待缴费', paid_date: null },
                { patent_no: '202010123456.7', patent_name: '一种基于深度学习的图像识别方法', year_index: 2, amount: 135, due_date: daysLater(60), status: '待缴费', paid_date: null },
                { patent_no: '202110234567.8', patent_name: '一种智能垃圾分类装置', year_index: 1, amount: 90, due_date: daysAgo(15), status: '待缴费', paid_date: null },
                { patent_no: '202110234567.8', patent_name: '一种智能垃圾分类装置', year_index: 2, amount: 90, due_date: daysLater(90), status: '待缴费', paid_date: null },
                { patent_no: '202310567890.1', patent_name: '一种自动化农业灌溉系统', year_index: 1, amount: 90, due_date: daysAgo(60), status: '已缴费', paid_date: daysAgo(65) },
                { patent_no: '202310567890.1', patent_name: '一种自动化农业灌溉系统', year_index: 2, amount: 90, due_date: daysLater(120), status: '待缴费', paid_date: null },
            ],
            '公布印刷费': [ // 5笔 ¥150
                { patent_no: '202410789012.3', patent_name: '一种新型可折叠电子设备', year_index: null, amount: 50, due_date: daysLater(10), status: '待缴费', paid_date: null },
                { patent_no: '202410890123.4', patent_name: '一种环保型包装材料', year_index: null, amount: 0, due_date: daysAgo(60), status: '已缴费', paid_date: daysAgo(65) },
                { patent_no: '202410901234.5', patent_name: '智能水杯', year_index: null, amount: 0, due_date: daysLater(35), status: '待缴费', paid_date: null },
                { patent_no: '202310678901.2', patent_name: '基于AI的语音助手交互方法', year_index: null, amount: 50, due_date: daysLater(20), status: '待缴费', paid_date: null },
                { patent_no: '202210456789.0', patent_name: '一种区块链数据存储方法及系统', year_index: null, amount: 50, due_date: daysLater(45), status: '待缴费', paid_date: null },
            ],
            '实质审查费': [ // 1笔 ¥2,500
                { patent_no: '202210456789.0', patent_name: '一种区块链数据存储方法及系统', year_index: null, amount: 2500, due_date: daysLater(700), status: '待缴费', paid_date: null },
            ],
            '授权登记费': [ // 3笔 ¥650
                { patent_no: '202010123456.7', patent_name: '一种基于深度学习的图像识别方法', year_index: null, amount: 250, due_date: daysAgo(400), status: '已缴费', paid_date: daysAgo(410) },
                { patent_no: '202110234567.8', patent_name: '一种智能垃圾分类装置', year_index: null, amount: 200, due_date: daysAgo(200), status: '已缴费', paid_date: daysAgo(210) },
                { patent_no: '202210345678.9', patent_name: '智能手表（圆形表盘）', year_index: null, amount: 200, due_date: daysAgo(150), status: '已缴费', paid_date: daysAgo(160) },
            ],
        };
        // 根据第一个参数（feeType）筛选，只返回对应费用类型的明细
        if (params && params.length > 0 && feeDetailMap[params[0]]) {
            return feeDetailMap[params[0]];
        }
        return [];
    }

    // patents 表 SELECT 查询
    function handlePatentSelect(sql, params) {
        // 如果是 WHERE id = ？返回单条
        if (/WHERE\s+id\s*=\s*\?/i.test(sql) && params.length > 0) {
            const p = mockPatents.find(pt => pt.id === params[0]);
            return p ? [p] : [];
        }
        // WHERE patent_no = ？ 查重
        if (/WHERE\s+patent_no\s*=\s*\?/i.test(sql) && params.length > 0) {
            const p = mockPatents.find(pt => pt.patent_no === params[0]);
            return p ? [{ id: p.id, patent_name: p.patent_name, is_deleted: p.is_deleted }] : [];
        }
        // 带筛选条件的列表查询（工作台）
        return filterPatents(sql, params);
    }

    function filterPatents(sql, params) {
        let list = mockPatents.filter(p => p.is_deleted === 0);
        const where = getWhereCondition(sql);

        // 回收站查询
        if (/is_deleted\s*=\s*1/i.test(where)) {
            list = mockPatents.filter(p => p.is_deleted === 1);
            // 按 deleted_at 排序
            return list.sort((a,b) => (b.deleted_at||'').localeCompare(a.deleted_at||''));
        }

        // 关键词搜索
        if (/LIKE/i.test(where) && params.length > 0) {
            const kw = params[0].replace(/%/g, '').toLowerCase();
            if (kw) {
                list = list.filter(p =>
                    (p.patent_no && p.patent_no.toLowerCase().includes(kw)) ||
                    (p.patent_name && p.patent_name.toLowerCase().includes(kw)) ||
                    (p.inventor && p.inventor.toLowerCase().includes(kw))
                );
            }
        }

        // 类型筛选
        const typeIdx = where.indexOf('patent_type');
        if (typeIdx >= 0) {
            // 找 ? 对应的参数位置 — 简单方式：统计类型筛选前的 ?
            const beforeType = where.substring(0, typeIdx);
            const qCount = (beforeType.match(/\?/g) || []).length;
            if (params[qCount]) {
                list = list.filter(p => p.patent_type === params[qCount]);
            }
        }

        // 状态筛选
        const statusIdx = where.indexOf('status');
        if (statusIdx >= 0 && !where.includes('status_transitions')) {
            const beforeStatus = where.substring(0, statusIdx);
            const qCount = (beforeStatus.match(/\?/g) || []).length;
            if (params[qCount]) {
                list = list.filter(p => p.status === params[qCount]);
            }
        }

        // 日期筛选
        if (/apply_date\s*>=\s*\?/i.test(where) && params.length > 1) {
            // 找到对应参数
            const before = where.substring(0, where.indexOf('apply_date'));
            const qCount = (before.match(/\?/g) || []).length;
            if (params[qCount]) {
                list = list.filter(p => p.apply_date && p.apply_date >= params[qCount]);
            }
        }
        if (/apply_date\s*<=\s*\?/i.test(where) && params.length > 1) {
            const before = where.substring(0, where.indexOf('apply_date'));
            const qCount = (before.match(/\?/g) || []).length;
            if (params[qCount]) {
                list = list.filter(p => p.apply_date && p.apply_date <= params[qCount]);
            }
        }

        // 处理 ORDER BY 和 LIMIT（页面使用 ORDER BY created_at DESC LIMIT ? OFFSET ?）
        const hasLimit = /\bLIMIT\s+\?/i.test(sql);
        const hasOffset = /\bOFFSET\s+\?/i.test(sql);

        // 按创建时间倒序
        list.sort((a, b) => (b.created_at||'').localeCompare(a.created_at||''));

        if (hasLimit && hasOffset && params.length >= 2) {
            const limitIdx = params.length - 2;
            const offsetIdx = params.length - 1;
            const limit = params[limitIdx] || list.length;
            const offset = params[offsetIdx] || 0;
            list = list.slice(offset, offset + limit);
        } else if (hasLimit && params.length >= 1) {
            const limit = params[params.length - 1] || list.length;
            list = list.slice(0, limit);
        }

        return list;
    }

    // fee_tasks 表查询
    function handleFeeTaskSelect(sql, params) {
        let list = [...mockFeeTasks];
        const where = getWhereCondition(sql);

        // 按 patent_id 过滤
        if (/patent_id\s*=\s*\?/i.test(where) && params.length > 0) {
            list = list.filter(t => t.patent_id === params[0]);
        }
        if (/patent_id\s+IN\s*\(/i.test(where)) {
            const count = extractIdsFromIn(where);
            if (count && params.length >= count) {
                const ids = params.slice(0, count);
                list = list.filter(t => ids.includes(t.patent_id));
            }
        }

        // 状态过滤
        if (/status\s*=\s*['"]待缴费['"]/i.test(where)) {
            list = list.filter(t => t.status === '待缴费');
        }

        // 年份月份过滤
        if (/strftime/i.test(where) && params.length >= 2) {
            const startMonth = params[0];
            const endMonth = params[1];
            if (startMonth) {
                list = list.filter(t => t.due_date && t.due_date >= startMonth + '-01');
            }
            if (endMonth) {
                list = list.filter(t => t.due_date && t.due_date <= endMonth + '-31');
            }
        }

        // ORDER BY
        if (/ORDER\s+BY\s+due_date\s+ASC/i.test(sql)) {
            list.sort((a,b) => (a.due_date||'').localeCompare(b.due_date||''));
        }

        // LIMIT 1
        if (/\bLIMIT\s+1\b/i.test(sql)) {
            list = list.slice(0, 1);
        }

        return list;
    }

    // status_transitions 查询
    function handleTransitionSelect(sql, params) {
        let list = [...mockStatusTransitions];
        // 过滤: current_status = ? OR current_status = '任一'
        if (params.length > 0) {
            const status = params[0];
            list = list.filter(t => t.current_status === status || t.current_status === '任一');
        }
        // 处理多个 status: current_status IN (?,?,?)
        if (/IN\s*\(/i.test(sql) && !hasInCondition) {
            const m = sql.match(/IN\s*\(([^)]+)\)/);
            if (m) {
                const count = m[1].split(',').filter(s => s.trim() === '?').length;
                if (count && params.length >= count) {
                    const statuses = params.slice(0, count);
                    list = list.filter(t => statuses.includes(t.current_status) || t.current_status === '任一');
                }
            }
        }
        return list;
    }

    // attachments 查询
    function handleAttachmentSelect(sql, params) {
        let list = [...mockAttachments];
        if (/patent_id\s*=\s*\?/i.test(sql) && params.length > 0) {
            list = list.filter(a => a.patent_id === params[0]);
        }
        if (/patent_id\s+IN\s*\(/i.test(sql)) {
            const count = extractIdsFromIn(sql);
            if (count && params.length >= count) {
                const ids = params.slice(0, count);
                list = list.filter(a => ids.includes(a.patent_id));
            }
        }
        // 如果只查 file_type
        if (/SELECT\s+file_type/i.test(sql)) {
            return list.map(a => ({ file_type: a.file_type }));
        }
        // ORDER BY uploaded_at DESC
        if (/ORDER\s+BY\s+uploaded_at\s+DESC/i.test(sql)) {
            list.sort((a,b) => (b.uploaded_at||'').localeCompare(a.uploaded_at||''));
        }
        return list;
    }

    // pending_urgent_tasks 查询
    function handlePendingTaskSelect(sql, params) {
        if (/patent_id\s*=\s*\?/i.test(sql) && params.length > 0) {
            // 专利1有一条手动待办
            if (params[0] === 1) {
                return [{ id:1, patent_id:1, task_desc:'待上传：缴费凭证', task_type:'attachment', created_at:daysAgo(10) }];
            }
            return [];
        }
        if (/patent_id\s+IN/i.test(sql)) {
            return []; // demo 无批量待办
        }
        return [];
    }

    // operation_logs 查询
    function handleLogSelect(sql, params) {
        let list = [...mockOperationLogs];
        if (/patent_id\s*=\s*\?/i.test(sql) && params.length > 0) {
            list = list.filter(l => l.patent_id === params[0]);
        }
        if (/ORDER\s+BY\s+created_at\s+DESC/i.test(sql)) {
            list.sort((a,b) => (b.created_at||'').localeCompare(a.created_at||''));
        }
        if (/\bLIMIT\s+(\d+)\b/i.test(sql)) {
            const limit = parseInt(RegExp.$1);
            list = list.slice(0, limit);
        }
        return list;
    }

    // ---- 2d. dbRun 处理器 ----
    function mockDbRun(sql, params) {
        params = params || [];
        const upper = sql.trim().toUpperCase();

        // 记录所有写入操作到 log
        // console.log('dbRun:', sql.substring(0,120), params);

        if (upper.startsWith('INSERT')) {
            return handleInsert(sql, params);
        }
        if (upper.startsWith('UPDATE')) {
            return handleUpdate(sql, params);
        }
        if (upper.startsWith('DELETE')) {
            return handleDelete(sql, params);
        }

        return { changes: 0, lastInsertRowid: null };
    }

    function handleInsert(sql, params) {
        // 写入 patents 表
        if (/INTO\s+patents/i.test(sql)) {
            const newPatent = {
                id: nextId.patents++,
                patent_no: params[0] || '',
                patent_name: params[1] || '',
                patent_type: params[2] || '',
                inventor: params[3] || '',
                applicant: params[4] || '',
                apply_date: params[5] || null,
                authorize_date: params[6] || null,
                status: params[7] || '撰写中',
                fee_reduction: params[8] || '无',
                notes: params[9] || '',
                is_deleted: 0,
                deleted_at: null,
                created_at: nowStr() + ' 00:00:00',
                updated_at: nowStr() + ' 00:00:00',
            };
            mockPatents.push(newPatent);
            return { changes: 1, lastInsertRowid: newPatent.id };
        }

        // 写入 fee_tasks
        if (/INTO\s+fee_tasks/i.test(sql)) {
            const newTask = {
                id: nextId.feeTasks++,
                patent_id: params[0],
                fee_type: params[1],
                year_index: params[2],
                amount: params[3] || 0,
                due_date: params[4],
                status: params[5] || '待缴费',
                paid_date: null,
                paid_amount: 0,
                penalty_rate: 0,
                paid_year: null,
                created_at: nowStr() + ' 00:00:00',
            };
            mockFeeTasks.push(newTask);
            return { changes: 1, lastInsertRowid: newTask.id };
        }

        // 写入 operation_logs
        if (/INTO\s+operation_logs/i.test(sql)) {
            const newLog = {
                id: nextId.logs++,
                patent_id: params[0],
                action_type: params[1] || '修改',
                description: params[2] || sql.substring(0,100),
                operator: '系统',
                created_at: nowStr() + ' 00:00:00',
            };
            mockOperationLogs.push(newLog);
            return { changes: 1, lastInsertRowid: newLog.id };
        }

        // 写入 settings
        if (/INTO\s+settings/i.test(sql)) {
            if (params[0] && params[1] !== undefined) {
                mockSettings[params[0]] = params[1];
            }
            return { changes: 1, lastInsertRowid: null };
        }

        // 写入 pending_urgent_tasks
        if (/INTO\s+pending_urgent_tasks/i.test(sql)) {
            return { changes: 1, lastInsertRowid: nextId.pendingTasks++ };
        }

        return { changes: 1, lastInsertRowid: nextId.patents };
    }

    function handleUpdate(sql, params) {
        // 更新 patent 状态
        if (/UPDATE\s+patents/i.test(sql)) {
            const patentId = params[params.length - 1]; // id 通常在最后
            const patent = mockPatents.find(p => p.id === patentId);
            if (patent) {
                // 状态更新
                if (/SET\s+status\s*=\s*\?/i.test(sql)) {
                    patent.status = params[0];
                }
                // 软删除
                if (/SET\s+is_deleted\s*=\s*1/i.test(sql)) {
                    patent.is_deleted = 1;
                    patent.deleted_at = nowStr() + ' 00:00:00';
                }
                // 恢复
                if (/SET\s+is_deleted\s*=\s*0/i.test(sql)) {
                    patent.is_deleted = 0;
                    patent.deleted_at = null;
                }
                // 批量更新 is_deleted
                if (/is_deleted\s*=\s*0/i.test(sql) && /deleted_at\s*=\s*NULL/i.test(sql)) {
                    // 批量恢复
                    // params 中的 id 列表
                }
                // 全字段更新
                if (/patent_no\s*=\s*\?/i.test(sql) && params.length > 1) {
                    patent.patent_no = params[0];
                    patent.patent_name = params[1];
                    patent.patent_type = params[2];
                    patent.inventor = params[3];
                    patent.applicant = params[4];
                    patent.apply_date = params[5];
                    patent.authorize_date = params[6];
                    patent.status = params[7];
                    patent.fee_reduction = params[8];
                    patent.notes = params[9];
                    patent.updated_at = nowStr() + ' 00:00:00';
                }
            }
            return { changes: 1, lastInsertRowid: null };
        }

        // 更新 fee_tasks
        if (/UPDATE\s+fee_tasks/i.test(sql)) {
            const taskId = params[params.length - 1];
            const task = mockFeeTasks.find(t => t.id === taskId);
            if (task) {
                if (/SET\s+status\s*=\s*['"]已缴费['"]/i.test(sql)) {
                    task.status = '已缴费';
                    task.paid_date = nowStr();
                    task.paid_amount = task.amount;
                }
                if (/SET\s+status\s*=\s*['"]已失效['"]/i.test(sql)) {
                    task.status = '已失效';
                }
                // 更新 fee_tasks SET fee_type, year_index, amount, due_date
                if (/SET\s+fee_type\s*=\s*\?/i.test(sql)) {
                    task.fee_type = params[0];
                    task.year_index = params[1];
                    task.amount = params[2];
                    task.due_date = params[3];
                }
            }
            // 批量更新 fee_tasks 状态（按 patent_id）
            if (/patent_id\s*=\s*\?/i.test(sql) && patentId !== undefined) {
                const pid = params[0];
                mockFeeTasks.forEach(t => {
                    if (t.patent_id === pid && t.status === '待缴费') t.status = '已失效';
                });
            }
            return { changes: 1, lastInsertRowid: null };
        }

        // 更新 pending_urgent_tasks
        if (/UPDATE\s+pending_urgent_tasks/i.test(sql)) {
            return { changes: 1, lastInsertRowid: null };
        }

        return { changes: 1, lastInsertRowid: null };
    }

    function handleDelete(sql, params) {
        // 永久删除 patents
        if (/DELETE\s+FROM\s+patents/i.test(sql)) {
            const where = getWhereCondition(sql);
            if (/is_deleted\s*=\s*1/i.test(where) && params.length > 0) {
                // 按 ID 删除
                if (/id\s+IN/i.test(where)) {
                    const ids = params.filter(p => typeof p === 'number');
                    for (let i = mockPatents.length - 1; i >= 0; i--) {
                        if (ids.includes(mockPatents[i].id)) mockPatents.splice(i, 1);
                    }
                    return { changes: ids.length, lastInsertRowid: null };
                }
                if (/id\s*=\s*\?/i.test(where) && params.length > 0) {
                    const idx = mockPatents.findIndex(p => p.id === params[0] && p.is_deleted === 1);
                    if (idx >= 0) { mockPatents.splice(idx, 1); return { changes: 1, lastInsertRowid: null }; }
                }
            }
            // 清理回收站（is_deleted=1 AND deleted_at < 30天前）
            if (/is_deleted\s*=\s*1/i.test(where) && /datetime/i.test(where)) {
                // 清理2条
                const toRemove = mockPatents.filter(p => p.is_deleted === 1);
                toRemove.forEach(p => {
                    const idx = mockPatents.indexOf(p);
                    if (idx >= 0) mockPatents.splice(idx, 1);
                });
                return { changes: toRemove.length || 1, lastInsertRowid: null };
            }
            return { changes: 1, lastInsertRowid: null };
        }

        // 删除 pending_urgent_tasks
        if (/DELETE\s+FROM\s+pending_urgent_tasks/i.test(sql)) {
            return { changes: 1, lastInsertRowid: null };
        }

        return { changes: 1, lastInsertRowid: null };
    }

    // ============================================
    // 3. 暴露 window.patentAPI
    // ============================================
    window.patentAPI = {
        // ---- 数据库操作 ----
        dbQuery: async function(sql, params) { return mockDbQuery(sql, params); },
        dbRun: async function(sql, params) { return mockDbRun(sql, params); },

        // ---- 密码锁 ----
        checkPasswordSet: async function () {
            return passwordSet;
        },
        setPassword: async function (password) {
            passwordSet = true;
            return true;
        },
        verifyPassword: async function (password) {
            // 任何密码都通过（演示用）
            return true;
        },
        getSecurityQuestion: async function () {
            return mockSettings['security_question'] || null;
        },
        verifySecurityAnswer: async function (answer) {
            // 任何答案都通过（演示用）
            return true;
        },

        // ---- 备份 ----
        backupDatabase: async function () {
            return true;
        },
        getBackups: async function () {
            return [];
        },

        // ---- 附件管理 ----
        uploadFile: async function (patentId, fileName, fileType, fileData) {
            const newAtt = {
                id: nextId.attachments++,
                patent_id: patentId,
                file_name: fileName,
                file_path: 'uploads/' + patentId + '/' + fileName,
                file_type: fileType,
                uploaded_at: nowStr(),
            };
            mockAttachments.push(newAtt);
            return { id: newAtt.id, file_path: newAtt.file_path };
        },
        deleteAttachment: async function (id) {
            const idx = mockAttachments.findIndex(a => a.id === id);
            if (idx >= 0) mockAttachments.splice(idx, 1);
            return true;
        },
        getAttachmentPath: async function (id) {
            const att = mockAttachments.find(a => a.id === id);
            return att ? att.file_path : null;
        },

        // ---- 文件对话框（浏览器版不支持） ----
        openFileDialog: function () { return null; },
        saveFileDialog: function () { return null; },
        getAppPath: function () { return null; },
        selectDirectory: undefined,
        readFile: function () { return null; },

        // ---- 应用控制 ----
        restartApp: function () {},
        getMigrationInfo: async function () {
            return { currentPath: '（演示模式）', size: 0, patentCount: mockPatents.filter(p=>!p.is_deleted).length, backupCount: 0 };
        },
        executeMigration: async function () {
            return { success: false, error: '演示模式不支持数据迁移' };
        },
        cleanupOldDb: async function () {
            return { success: true };
        },

        // ---- 事件监听 ----
        onBackupReady: function () {},

        // ---- AI 智能工具（模拟） ----
        aiClassify: async function (input, taskType) {
            // 模拟 LLM 调用延迟
            await new Promise(function (r) { setTimeout(r, 1500 + Math.random() * 1000); });
            if (taskType === 'classify') {
                var ipcs = [
                    { ipc: 'G06F 17/30', basis: '电数字数据处理 → 信息检索；及其数据库结构', confidence: '高', confidenceReason: '摘要明确涉及信息检索算法，唯一指向G06F' },
                    { ipc: 'G06N 3/08', basis: '基于特定计算模型的计算机系统 → 神经网络学习方法', confidence: '高', confidenceReason: '技术手段为神经网络训练，唯一指向G06N' },
                    { ipc: 'G06K 9/62', basis: '用于阅读或识别印刷或书写字符的方法或装置 → 图像识别', confidence: '中', confidenceReason: '涉及图像识别，候选G06K/G06V，但G06K更贴近' },
                    { ipc: 'H04L 29/06', basis: '数字信息的传输 → 以协议为特征的', confidence: '中', confidenceReason: '涉及通信协议，候选H04L/H04W，细节偏向H04L' },
                    { ipc: 'G06Q 10/06', basis: '行政、管理、商业或经营通用的数据处理系统 → 资源或工作流管理', confidence: '低', confidenceReason: '涉及管理流程，可能涉及G06Q/G06F，信息不足以精确区分' },
                    { ipc: 'A61B 5/00', basis: '用于诊断目的的测量 → 人体部位的测量', confidence: '低', confidenceReason: '仅提到医疗检测，未明确技术手段，推测到A61B' },
                ];
                var result = ipcs[Math.floor(Math.random() * ipcs.length)];
                return result;
            } else {
                var summaries = [
                    '本发明提供一种数据处理方法，包括：获取原始数据，对原始数据进行预处理，提取特征信息，基于预设算法对特征信息进行分析处理，输出分析结果。该方法能够有效提高数据处理效率和准确性。',
                    '本实用新型公开了一种智能装置，包括壳体、控制模块、传感器模块和执行模块。控制模块分别与传感器模块和执行模块电连接。传感器模块用于采集环境数据，控制模块根据环境数据分析结果控制执行模块动作。',
                    '本发明涉及一种图像识别方法及系统。该方法包括：构建卷积神经网络模型，利用训练数据集对模型进行训练，获取待识别图像，将待识别图像输入训练好的模型，输出识别结果。',
                ];
                return { summary: summaries[Math.floor(Math.random() * summaries.length)] };
            }
        },
    };

    console.log('[Demo Mock] window.patentAPI 已注入（演示模式）');
})();

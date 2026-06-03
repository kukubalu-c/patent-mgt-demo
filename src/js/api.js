/**
 * 文件名：api.js
 * 作用：前端 API 适配层，封装 fetch 调用，暴露 window.patentAPI 接口
 * 被哪些文件调用：index.html 底部引入（所有页面共用）
 * 依赖：无外部依赖
 * 使用场景：所有前端 JS 通过 window.patentAPI 访问后端能力
 *
 * 注意：此模块仅在 Web 模式（node server.js）下生效。
 * Electron 模式下 preload.js 通过 contextBridge 提前注入了 patentAPI，
 * 此处检测到已存在则跳过，避免覆盖。
 */

(function () {
    // Electron 模式下 preload.js 已提供 patentAPI，跳过
    if (window.patentAPI) return;
    // 变量名：API_BASE
    // 作用：后端 API 的基础 URL
    const API_BASE = 'http://localhost:3000/api';

    /**
     * 函数名：apiPost
     * 作用：发送 POST 请求到后端 API
     * 参数：
     *   - path - string - API 路径（如 '/db/query'）
     *   - body - Object - 请求体对象
     * 返回值：Promise<any> - 后端返回的数据
     * 使用场景：所有前端-后端通信
     */
    async function apiPost(path, body) {
        const res = await fetch(API_BASE + path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return data;
    }

    /**
     * 函数名：apiGet
     * 作用：发送 GET 请求到后端 API
     * 参数：
     *   - path - string - API 路径
     * 返回值：Promise<any> - 后端返回的数据
     * 使用场景：无需请求体的查询
     */
    async function apiGet(path) {
        const res = await fetch(API_BASE + path);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return data;
    }

    // 暴露给全局的 API 接口
    window.patentAPI = {
        // === 数据库操作 ===
        dbQuery: (sql, params) => apiPost('/db/query', { sql, params }),
        dbRun: (sql, params) => apiPost('/db/run', { sql, params }),

        // === 密码锁 ===
        verifyPassword: async (password) => {
            const result = await apiPost('/auth/verify', { password });
            return result.success;
        },
        setPassword: async (password) => {
            const result = await apiPost('/auth/set', { password });
            return result.success;
        },
        checkPasswordSet: async () => {
            const result = await apiGet('/auth/isset');
            return result.isSet;
        },
        getSecurityQuestion: async () => {
            const result = await apiGet('/auth/security-question');
            return result.question;
        },
        verifySecurityAnswer: async (answer) => {
            const result = await apiPost('/auth/verify-security', { answer });
            return result.success;
        },

        // === 备份 ===
        backupDatabase: async () => {
            const result = await apiPost('/db/backup', {});
            return result.success;
        },
        getBackups: async () => {
            const result = await apiGet('/db/backups');
            return result.backups;
        },

        // === 文件对话框（浏览器版暂不支持，返回 null） ===
        openFileDialog: () => null,
        saveFileDialog: () => null,
        getAppPath: () => null,

        // === 附件管理 ===
        uploadFile: async (patentId, fileName, fileType, fileData) => {
            const result = await apiPost('/upload', {
                patent_id: patentId,
                file_name: fileName,
                file_type: fileType,
                file_data: fileData
            });
            return result;
        },
        deleteAttachment: async (id) => {
            const result = await apiPost('/attachments/delete', { id });
            return result.success;
        },

        // === 事件监听（浏览器版无 IPC，空函数） ===
        onBackupReady: () => {}
    };
})();

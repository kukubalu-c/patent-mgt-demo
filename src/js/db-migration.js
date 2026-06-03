/**
 * 文件名：db-migration.js
 * 作用：数据迁移界面 —— 图形化移动数据库位置
 * 被哪些文件调用：index.html 底部引入
 * 依赖：window.patentAPI
 * 使用场景：用户侧边栏点击"数据管理"→ 迁移弹窗
 *
 * 仅在 Electron 模式下生效（patentAPI.selectDirectory 存在）
 * 注意：弹窗通过 JS 动态创建，不依赖 HTML 预设结构
 */

(function() {
    const btn = document.getElementById('sidebarDataBtn');
    if (!btn) {
        console.warn('db-migration: #sidebarDataBtn not found');
        return;
    }
    btn.addEventListener('click', openMigrationModal);
})();

/**
 * 函数名：openMigrationModal
 * 作用：创建并显示数据迁移弹窗，加载当前数据库信息
 */
async function openMigrationModal() {
    // ========== 创建覆盖层 ==========
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:10000;overflow-y:auto;padding:40px;';

    // ========== 创建弹窗 ==========
    const modal = document.createElement('div');
    modal.style.cssText = 'background:#fff;border-radius:12px;width:560px;max-width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.15);margin:auto;';

    // 弹头
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:20px 24px 0;';
    header.innerHTML = '<h4 style="margin:0;font-size:16px;">数据管理</h4>';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'background:none;border:none;font-size:24px;cursor:pointer;color:#999;padding:0;line-height:1;';
    closeBtn.onclick = () => overlay.remove();
    header.appendChild(closeBtn);
    modal.appendChild(header);

    // 提示文字
    const hint = document.createElement('p');
    hint.style.cssText = 'font-size:13px;color:#888;margin:8px 24px 16px;';
    hint.textContent = '查看数据库信息或移动数据库到其他位置';
    modal.appendChild(hint);

    // 内容区
    const content = document.createElement('div');
    content.style.cssText = 'padding:0 24px 20px;';
    modal.appendChild(content);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 点击空白关闭
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    // ========== 加载内容 ==========

    // 检查是否支持迁移（仅在 Electron 模式下有 selectDirectory）
    if (!window.patentAPI.selectDirectory) {
        content.innerHTML = '<p style="color:#888;text-align:center;padding:40px 0;">数据迁移功能仅在桌面版可用</p>';
        return;
    }

    // 加载当前信息
    let info;
    try {
        info = await window.patentAPI.getMigrationInfo();
    } catch (e) {
        content.innerHTML = '<p style="color:#f5222d;text-align:center;padding:40px 0;">加载数据库信息失败</p>';
        return;
    }

    const sizeStr = info.size > 1048576
        ? (info.size / 1048576).toFixed(1) + ' MB'
        : (info.size / 1024).toFixed(1) + ' KB';

    content.innerHTML = `
        <div class="migration-info">
            <div class="migration-row">
                <span class="migration-label">当前位置</span>
                <span class="migration-value migration-path">${info.currentPath}</span>
            </div>
            <div class="migration-row">
                <span class="migration-label">数据库大小</span>
                <span class="migration-value">${sizeStr}</span>
            </div>
            <div class="migration-row">
                <span class="migration-label">专利数量</span>
                <span class="migration-value">${info.patentCount} 条</span>
            </div>
        </div>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e8e8e8;">
            <button class="btn btn-primary" id="migrationStartBtn">选择新位置并迁移</button>
            <div id="migrationResult" style="margin-top:12px;"></div>
        </div>
    `;

    // 绑定迁移按钮
    document.getElementById('migrationStartBtn').addEventListener('click', async () => {
        const resultDiv = document.getElementById('migrationResult');
        const btn = document.getElementById('migrationStartBtn');

        const targetDir = await window.patentAPI.selectDirectory();
        if (!targetDir) return;

        btn.disabled = true;
        btn.textContent = '正在迁移...';
        resultDiv.innerHTML = '<p style="color:#888;">正在复制数据库文件...</p>';

        try {
            const result = await window.patentAPI.executeMigration(targetDir);
            if (result.success) {
                resultDiv.innerHTML = `
                    <div style="background:#f6ffed;border:1px solid #b7eb8f;border-radius:6px;padding:12px 16px;">
                        <p style="color:#52c41a;font-weight:500;margin-bottom:8px;">✅ 迁移成功</p>
                        <p style="font-size:13px;color:#333;margin-bottom:8px;">新位置：${result.newPath}</p>
                        <p style="font-size:13px;color:#888;margin-bottom:12px;">重启程序后生效</p>
                        <label style="font-size:13px;display:flex;align-items:center;gap:6px;cursor:pointer;">
                            <input type="checkbox" id="migrationDeleteOld"> 删除旧位置的文件
                        </label>
                        <button class="btn" id="migrationRestartBtn" style="margin-top:8px;">立即重启</button>
                    </div>
                `;
                document.getElementById('migrationDeleteOld')?.addEventListener('change', async (e) => {
                    if (e.target.checked) {
                        await window.patentAPI.cleanupOldDb();
                    }
                });
                document.getElementById('migrationRestartBtn').addEventListener('click', () => {
                    window.patentAPI.restartApp?.();
                });
            } else {
                resultDiv.innerHTML = `<p style="color:#f5222d;">迁移失败：${result.error}</p>`;
                btn.disabled = false;
                btn.textContent = '选择新位置并迁移';
            }
        } catch (e) {
            resultDiv.innerHTML = `<p style="color:#f5222d;">迁移失败：${e.message}</p>`;
            btn.disabled = false;
            btn.textContent = '选择新位置并迁移';
        }
    });
}

// Bootstrap-Growl Notification Manager
window.notificationManager = {
    show: function (message, type, position, align, delay, icon) {
        // Map type để sử dụng với bootstrap-growl
        const typeMap = {
            'success': {
                cssClass: 'alert alert-success',
                bootstrapGrowlType: 'success'
            },
            'danger': {
                cssClass: 'alert alert-danger',
                bootstrapGrowlType: 'danger'
            },
            'warning': {
                cssClass: 'alert alert-warning',
                bootstrapGrowlType: 'warning'
            },
            'info': {
                cssClass: 'alert alert-info',
                bootstrapGrowlType: 'info'
            },
            'primary': {
                cssClass: 'alert alert-primary',
                bootstrapGrowlType: 'primary'
            },
            'inverse': {
                cssClass: 'alert alert-inverse',
                bootstrapGrowlType: 'inverse'
            }
        };

        const notificationType = typeMap[type] || typeMap['info'];
        
        // Cấu hình vị trí
        const allowDismiss = true;
        const placement = {
            from: position === 'bottom' ? 'bottom' : 'top',
            align: align === 'left' ? 'left' : (align === 'center' ? 'center' : 'right')
        };

        // Tạo HTML nội dung notification
        const iconHtml = icon ? `<i class="${icon}" style="margin-right: 8px;"></i>` : '';
        const content = `${iconHtml}${message}`;

        // Sử dụng bootstrap-growl nếu có
        if (typeof $.growl !== 'undefined') {
            $.growl({
                message: content,
                duration: delay
            }, {
                type: notificationType.bootstrapGrowlType,
                placement: placement,
                offset: { x: 20, y: 20 },
                allow_dismiss: allowDismiss,
                delay: delay,
                animate: {
                    enter: 'animated fadeInRight',
                    exit: 'animated fadeOutRight'
                }
            });
        } else {
            // Fallback: tạo notification tùy chỉnh nếu bootstrap-growl không có
            this.showFallback(message, type, position, align, delay, icon);
        }
    },

    showFallback: function (message, type, position, align, delay, icon) {
        // Fallback khi bootstrap-growl không sẵn có
        const typeMap = {
            'success': { bg: '#dff0d8', border: '#d0c743', color: '#3c763d' },
            'danger': { bg: '#f2dede', border: '#ebccd1', color: '#a94442' },
            'warning': { bg: '#fcf8e3', border: '#faebcc', color: '#8a6d3b' },
            'info': { bg: '#d9edf7', border: '#bce8f1', color: '#31708f' },
            'primary': { bg: '#d1ecf1', border: '#bee5eb', color: '#0c5460' },
            'inverse': { bg: '#f5f5f5', border: '#ddd', color: '#333' }
        };

        const colors = typeMap[type] || typeMap['info'];
        const notificationId = 'notification-' + Date.now();
        
        // Xác định vị trí CSS
        const positionY = position === 'bottom' ? 'bottom' : 'top';
        const positionX = align === 'left' ? 'left' : (align === 'center' ? 'left: 50%; transform: translateX(-50%);' : 'right');

        // Tạo HTML
        const iconHtml = icon ? `<i class="${icon}" style="margin-right: 10px;"></i>` : '';
        const notificationHtml = `
            <div id="${notificationId}" style="
                position: fixed;
                ${positionY}: 20px;
                ${typeof positionX === 'string' && positionX.includes('transform') ? positionX : (positionX + ': 20px;')}
                min-width: 300px;
                max-width: 500px;
                padding: 15px 20px;
                background-color: ${colors.bg};
                border-left: 4px solid ${colors.border};
                color: ${colors.color};
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                animation: slideInRight 0.3s ease-out;
                display: flex;
                align-items: center;
                font-size: 14px;
                line-height: 1.5;
            ">
                <span style="flex: 1;">${iconHtml}${message}</span>
                <button type="button" style="
                    background: none;
                    border: none;
                    color: ${colors.color};
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    margin-left: 10px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                " onclick="document.getElementById('${notificationId}').remove();" 
                onmouseover="this.style.opacity='1'" 
                onmouseout="this.style.opacity='0.7'">
                    ×
                </button>
            </div>
        `;

        // Thêm CSS animation nếu chưa có
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
                
                .notification-exit {
                    animation: slideOutRight 0.3s ease-out forwards !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Tạo container nếu chưa có
        let container = document.querySelector('#notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }

        // Thêm notification
        container.insertAdjacentHTML('beforeend', notificationHtml);
        const notificationEl = document.getElementById(notificationId);

        // Tự động xóa sau delay
        setTimeout(() => {
            notificationEl.classList.add('notification-exit');
            setTimeout(() => {
                notificationEl.remove();
            }, 300);
        }, delay);
    }
};
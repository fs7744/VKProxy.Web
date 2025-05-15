import { ElLoading } from 'element-plus'

class GlobalLoadingService {
    count: number = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loading: any = null;
    constructor() {
        this.count = 0;
        this.loading = null;
    }

    show(delay: number) {
        this.count++;
        if (delay && Number.isInteger(delay) && delay > 0) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const s = this;
            setTimeout(function () { s._updateStatus() }, delay);
        } else {
            this._updateStatus();
        }
    }

    hide() {
        this.count = Math.max(this.count - 1, 0);
        this._updateStatus();
    }

    _updateStatus() {
        if (this.count > 0) {
            if (!this.loading) {
                this.loading = ElLoading.service({ fullscreen: true });
            }
        } else {
            if (this.loading) {
                this.loading.close();
                this.loading = null;
            }
        }
    }
}

export const globalLoading = new GlobalLoadingService();

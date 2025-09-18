import Notify from "notiflix/build/notiflix-notify-aio";
import pkg from "notiflix/build/notiflix-loading-aio";

const useToast = {
    showSuccess(message) {
        Notify.Notify.success(message, {
            position: "center-center",
            timeout: 1000,
            clickToClose: true,
        });
    },

    showError(message) {
        Notify.Notify.failure(message, {
            position: "center-center",
            timeout: 3000,
            clickToClose: true,
        });
    },

    showInfo(message) {
        Notify.Notify.info(message, {
            position: "center-center",
            timeout: 2000,
            clickToClose: true,
        });
    },
};

export default useToast;

export function showLoading() {
    pkg.Loading.standard({
        clickToClose: false,
    });
}

export function hideLoading() {
    pkg.Loading.remove();
}

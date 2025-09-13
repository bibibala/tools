import { Notify } from "notiflix/build/notiflix-notify-aio";

const useToast = {
    showSuccess(message) {
        Notify.success(message, {
            position: "center-center",
            timeout: 1000,
            clickToClose: true,
        });
    },

    showError(message) {
        Notify.failure(message, {
            position: "center-center",
            timeout: 3000,
            clickToClose: true,
        });
    },

    showInfo(message) {
        Notify.info(message, {
            position: "center-center",
            timeout: 2000,
            clickToClose: true,
        });
    },
};

export default useToast;

import { toast } from "react-toastify";

export function saveToStorage(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}
export function getFromStorage(key, defaultKey) {
  if (localStorage.getItem(key) === null) return defaultKey;
  return JSON.parse(localStorage.getItem(key));
}

export const toastNoti = (text, type) => {
  switch (type) {
    case "error":
      return toast.error(text, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    case "success":
      return toast.success(text, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    default:
      return toast(text, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
  }
};

export const isEmptyObject = (myEmptyObj) => {
  return (
    Object.keys(myEmptyObj).length === 0 && myEmptyObj.constructor === Object
  );
};

export const checkDate = (startDate, endDate) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationDays = Math.round(Math.abs((start - end) / oneDay));
  return durationDays
}

export const validateProduct = (data, isEdit) => {
  if (Object.values(data).includes("")) {
    toastNoti("All fields are required!", "error")
    return false
  }
  if (data.category === "default") {
    toastNoti("You must select category for product!", "error")
    return false
  }
  if (!data.images) {
    toastNoti("You must upload images for product!", "error")
    return false
  }
  return true
}

export const generateBase64FromImage = imageFile => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = e => resolve(e.target.result);
    reader.onerror = err => reject(err);
  });

  reader.readAsDataURL(imageFile);
  return promise;
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(price)
    .replace("₫", "VND");
};
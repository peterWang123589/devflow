import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// export const getTimestamp = (createdAt: Date): string => {
//   debugger;
//   const now = new Date();
//   const timeDifference = now.getTime() - createdAt.getTime();

//   // Define time intervals in milliseconds
//   const minute = 60 * 1000;
//   const hour = 60 * minute;
//   const day = 24 * hour;
//   const week = 7 * day;
//   const month = 30 * day;
//   const year = 365 * day;

//   if (timeDifference < minute) {
//     const seconds = Math.floor(timeDifference / 1000);
//     return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
//   } else if (timeDifference < hour) {
//     const minutes = Math.floor(timeDifference / minute);
//     return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
//   } else if (timeDifference < day) {
//     const hours = Math.floor(timeDifference / hour);
//     return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
//   } else if (timeDifference < week) {
//     const days = Math.floor(timeDifference / day);
//     return `${days} ${days === 1 ? "day" : "days"} ago`;
//   } else if (timeDifference < month) {
//     const weeks = Math.floor(timeDifference / week);
//     return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
//   } else if (timeDifference < year) {
//     const months = Math.floor(timeDifference / month);
//     return `${months} ${months === 1 ? "month" : "months"} ago`;
//   } else {
//     const years = Math.floor(timeDifference / year);
//     return `${years} ${years === 1 ? "year" : "years"} ago`;
//   }
// };
export const getTimestamp = (createdAt: Date): string => {

  const now = new Date(); // 当前时间，不带时区信息
  const nowWithOffset = new Date(now.getTime() + now.getTimezoneOffset() * 60000); // 将当前时间转换为与 UTC 时间一致的时间

  const createdAtWithOffset = new Date(createdAt.getTime() + createdAt.getTimezoneOffset() * 60000); // 将创建时间转换为与 UTC 时间一致的时间
  const timeDifference = nowWithOffset.getTime() - createdAtWithOffset.getTime(); // 计算时间差

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (timeDifference < week) {
    const days = Math.floor(timeDifference / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (timeDifference < month) {
    const weeks = Math.floor(timeDifference / week);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(timeDifference / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};
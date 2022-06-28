import { Time } from "./interfaces";

export const convertToSec = (amount: number, type: Time) => {
  if(type == "days") return amount * 24 * 60 * 60;
  if(type == "hours") return amount * 60 * 60;
  if(type == "minutes") return amount * 60;
  if(type == "seconds") return amount;
}
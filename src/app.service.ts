import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  setTime(minutes: number): Date {
    const copiedDate = new Date();
    copiedDate.setTime(copiedDate.getTime() + minutes * 60 * 1000);
    return copiedDate;
  }  
}

export class DateUtils {
    
    static calculateAge(birthDate: Date): number {
        const currentDate = new Date();
        if (birthDate > currentDate) {
            return 0;
        }
      
        const birthYear = birthDate.getFullYear();
        const currentYear = currentDate.getFullYear();
        const birthMonth = birthDate.getMonth();
        const currentMonth = currentDate.getMonth();
        const birthDay = birthDate.getDate();
        const currentDay = currentDate.getDate();
      
        let age = currentYear - birthYear;
      
        // Adjust age if the birthday hasn't occurred yet this year
        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
            age--;
        }
      
        return age;
    }
}
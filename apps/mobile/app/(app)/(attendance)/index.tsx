import { AttendanceScreen } from '@/features/attendance/screens/attendance-screen';
import { AttendanceProvider } from '@/features/attendance/context/attendance';

export default function Attendance() {
  return (
    <AttendanceProvider>
      <AttendanceScreen />
    </AttendanceProvider>
  );
}

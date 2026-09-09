export type UserRole = 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  studentId?: string; // Links student/parent users to record
  parentId?: string;
  class?: string;
  board?: EducationalBoard;
  username?: string;
}

export type EducationalBoard = 'CBSE' | 'ICSE' | 'TG State Board' | 'AP State Board' | 'State Board' | 'IGCSE' | string;

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string; // e.g. "Class 10"
  board: EducationalBoard;
  batchId: string;
  batchName: string;
  email: string;
  phone: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive';
}


export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentIds: string[];
  address: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classes: string[];
}

export interface Batch {
  id: string;
  name: string;
  class: string;
  board: EducationalBoard;
  subject: string;
  schedule: string;
  time: string;
  maxStudents: number;
  currentCount: number;
}


export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  batchId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

export interface Homework {
  id: string;
  title: string;
  class: string;
  subject: string;
  batchId: string;
  batchName: string;
  dueDate: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  createdAt: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  homeworkTitle: string;
  studentId: string;
  studentName: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  submittedAt: string;
  marks?: number;
  maxMarks?: number;
  remarks?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface StudyMaterial {
  id: string;
  title: string;
  class: string;
  subject: string;
  category: 'PDF' | 'DOC' | 'Video' | 'Notes';
  fileUrl?: string;
  videoUrl?: string;
  fileName?: string;
  fileSize?: string;
  description?: string;
  extraInfo?: string;
  uploadedAt: string;
}

export interface OnlineClass {
  id: string;
  title: string;
  subject: string;
  class: string;
  batchId: string;
  batchName: string;
  date: string;
  startTime: string;
  endTime: string;
  platform?: 'Google Meet' | 'Zoom';
  meetLink: string;
  recordedVideoUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Test {
  id: string;
  title: string;
  type: 'daily' | 'weekly';
  class: string;
  subject: string;
  batchId: string;
  date: string;
  maxMarks: number;
}

export interface Result {
  id: string;
  testId?: string;
  title: string;
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  testDate: string;
}

export type TestResult = Result;

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  class: string;
  month: string;
  year?: string;
  amount: number;
  paymentDate?: string;
  paymentMode?: 'Razorpay' | 'UPI' | 'Card' | 'NetBanking' | 'Cash';
  razorpayPaymentId?: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

export type FeeRecord = FeePayment;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'homework' | 'test' | 'fee' | 'class';
  targetRole: 'all' | 'teacher' | 'student' | 'parent';
  targetBatchId?: string;
  targetStudentId?: string;
  createdAt: string;
  readBy: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Classroom' | 'Events' | 'Toppers' | 'Facilities';
  imageUrl: string;
  caption?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: 'Parent' | 'Student';
  content: string;
  rating: number;
  avatar?: string;
  batch?: string;
}

export interface DemoRegistration {
  id: string;
  parentName: string;
  studentName: string;
  phone: string;
  email: string;
  class: string;
  board: EducationalBoard;
  preferredTime: string;
  status: 'pending' | 'contacted' | 'approved';
  date: string;
}

export interface AdmissionRequest {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  class: string;
  board: EducationalBoard;
  prevPercentage: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}


export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
}

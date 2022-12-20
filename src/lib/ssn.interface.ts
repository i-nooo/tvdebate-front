// Meeting 에 종속
interface SpeechComponent {
  userID: string;
  contents: string;
  startAt: string;
  endAt?: string;
  duration?: string;
}

export interface ImageComponent {
  imageID: string;
  contentURL: string;
  markedAt: string;
}

// Read, Update 필요 (Update를 처리하지 않을경우 클라리언드 GUI 수정 예정)
// 사용자, 기간별 조회 필요.
export interface Meeting {
  meetingId: string;
  contents: string;
  speechs: SpeechComponent[];
  images: ImageComponent[];
  startAt: string;
  duration?: string;
  endAt: string;
  topics: string[]; // 추출 불가능 할 시 클라이언트에서 처리 필요
  with: User[];
  highlightItems: HighlightItem[];
  actionItems: ActionItem[];
}

// Read 필요
// 사용자 , 기간별 조회 필요
export interface HighlightItem {
  assignedUser: User;
  meetingID: string;
  name: string;
  with: User[];
  complete: boolean;
  date: string;
  completeDate: string;
}

// Read, Update 필요
// 사용자 , 기간별 조회 필요
export interface ActionItem {
  assignedUser: User;
  meetingID: string;
  name: string;
  with: User[];
  complete: boolean;
  date: string;
  completeDate: string;
}

// Read: userID 기반의 조회 필요
// 로그인 기능 필요
export interface User {
  userID: string;
  profileURL: string;
  name: string;
  dept: string;
  position: string;
}

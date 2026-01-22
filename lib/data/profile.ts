export interface Profile {
  name: string
  initials: string
  email: string
  phone?: string
  memberSince: string
  avatarUrl?: string
}

export const defaultProfile: Profile = {
  name: "Juwon",
  initials: "JO",
  email: "juwon@example.com",
  phone: "+1 (555) 123-4567",
  memberSince: "January 2024",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juwon",
}

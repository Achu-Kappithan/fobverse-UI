
export interface ProfileInterface {
  id:string

  name: string;

  email: string;

  role: string;

  profileImg?: string;

  password: string;
}

export interface UpdateAdminProfileInterface {

  name: string;

  email: string;

  profileImg?: string;

}
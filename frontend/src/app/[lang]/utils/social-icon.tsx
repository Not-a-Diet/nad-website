import { CgWebsite } from "react-icons/cg";
import { AiFillInstagram, AiFillTwitterCircle, AiFillYoutube, AiFillTikTok, AiFillLinkedin, AiOutlineWhatsApp, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
export function RenderSocialIcon({ social }: { social: string | undefined }) {
  switch (social) {
    case "WEBSITE":
      return <CgWebsite />;
    case "TWITTER":
      return <AiFillTwitterCircle />;
    case "YOUTUBE":
      return <AiFillYoutube />;
    case "INSTAGRAM":
      return <AiFillInstagram />;
    case "TIKTOK":
      return <AiFillTikTok />
    case "LINKEDIN":
      return <AiFillLinkedin />;
    case "WHATSAPP":
      return <AiOutlineWhatsApp />;
    case "EMAIL":
      return <AiOutlineMail />;
    case "PHONE":
      return <AiOutlinePhone />;
    default:
      return <CgWebsite/>;
  }
}
import { AuthChecker } from "type-graphql";
import { MyContext } from "../commons/types";

export const customAuthChecker: AuthChecker<MyContext> = ({ context }, guard) => {
  if (context.req.session) {
    if (guard.includes("ADMIN") && context.req.session.admin) return true; // next
    if (guard.includes("ACCOUNT") && context.req.session.account) return true; // next
    if (guard.includes("USER") && context.req.session.user) return true; // next
    return false; // dennied
  } else {
    return false; // dennied
  }
};

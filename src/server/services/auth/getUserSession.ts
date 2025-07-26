import "server-only";

import { auth } from "@/server/auth";
import { cache } from "react";

export default cache(auth);

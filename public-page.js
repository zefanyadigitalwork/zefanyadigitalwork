import { SiteCMS } from "./site.js";

SiteCMS.load().catch((error) => SiteCMS.showPublicError(error));

import type { MetadataRoute } from "next";
export default function sitemap():MetadataRoute.Sitemap{return ["","about","investment-model","portfolio","impact","farmers","leadership","insights","contact","legal"].map(p=>({url:`https://kisanimpactfund.org/${p}`,lastModified:new Date(),changeFrequency:p==="insights"?"monthly":"yearly",priority:p===""?1:.7}))}

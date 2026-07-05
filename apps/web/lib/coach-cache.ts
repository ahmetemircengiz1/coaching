import { unstable_cache, revalidateTag } from "next/cache";
import prisma from "@coach-os/database";

/**
 * Koç public profil verisi için paylaşılan cache katmanı.
 *
 * Landing sayfası + site layout'u (metadata dahil) her ziyarette DB'ye gidiyordu.
 * Bu veri kullanıcıya özel DEĞİL (public koç profili), o yüzden cross-request
 * paylaşılabilir. `unstable_cache` ile domain başına etiketlenip cache'lenir:
 *  - Koç bir şey kaydedince ilgili save action `revalidateCoachCache(domain)`
 *    çağırır → değişiklik ANINDA yansır ("landing dinamik" iş kuralı korunur).
 *  - Etiket çağrısını kaçırsak bile `revalidate: 60` güvenlik ağı en geç 60sn'de
 *    cache'i tazeler.
 *
 * NOT: Decimal alanlar (ör. package.price) serileştirmede string'e döner; landing
 * zaten `Number(pkg.price)` uyguladığı için bu güvenlidir.
 */

export const coachCacheTag = (domain: string) => `coach-${domain}`;

const CACHE_TTL_SECONDS = 60;

/** Layout + generateMetadata için hafif koç kaydı (subdomain → customDomain fallback). */
export function getCachedCoachByDomain(domain: string) {
  return unstable_cache(
    async () => {
      let coach = await prisma.coach.findUnique({
        where: { subdomain: domain },
        include: { package: true },
      });
      if (!coach) {
        coach = await prisma.coach.findUnique({
          where: { customDomain: domain },
          include: { package: true },
        });
      }
      return coach;
    },
    ["coach-by-domain", domain],
    { tags: [coachCacheTag(domain)], revalidate: CACHE_TTL_SECONDS }
  )();
}

/** Landing sayfası için tam koç verisi (paketler, dönüşümler, yorumlar, sayaçlar). */
export function getCachedLandingCoach(domain: string) {
  return unstable_cache(
    async () => {
      const include = {
        coachPackages: {
          where: { isActive: true },
          orderBy: { orderIndex: "asc" },
        },
        transformations: {
          where: { isPublished: true },
          orderBy: { orderIndex: "asc" },
          take: 8,
        },
        testimonials: {
          where: { isPublished: true },
          orderBy: { orderIndex: "asc" },
          take: 12,
        },
        _count: {
          select: { students: { where: { status: "active" } }, programs: true },
        },
      } as const;

      let coach = await prisma.coach.findUnique({
        where: { subdomain: domain },
        include,
      });
      if (!coach) {
        coach = await prisma.coach.findUnique({
          where: { customDomain: domain },
          include,
        });
      }
      return coach;
    },
    ["coach-landing", domain],
    { tags: [coachCacheTag(domain)], revalidate: CACHE_TTL_SECONDS }
  )();
}

/** Koç bir değişiklik kaydettiğinde public cache'ini anında tazele. */
export async function revalidateCoachCache(domain: string) {
  revalidateTag(coachCacheTag(domain));
}

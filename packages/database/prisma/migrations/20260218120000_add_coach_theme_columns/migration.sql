ALTER TABLE "Coach"
ADD COLUMN "landingThemeId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "dashboardThemeId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "plan" TEXT NOT NULL DEFAULT 'starter';

UPDATE "Coach"
SET "landingThemeId" = CASE "templateId"
  WHEN 'modern-teal' THEN 2
  WHEN 'fresh-light' THEN 3
  WHEN 'clean-red' THEN 4
  WHEN 'sport-dark' THEN 5
  ELSE 1
END;

UPDATE "Coach"
SET "dashboardThemeId" = CASE "dashboardTemplateId"
  WHEN 'dark-gold' THEN 2
  WHEN 'light-gold' THEN 3
  WHEN 'dark-orange' THEN 4
  WHEN 'light-modern' THEN 5
  ELSE 1
END;

UPDATE "Coach" c
SET "plan" = CASE
  WHEN p."tier" >= 3 THEN 'elite'
  WHEN p."tier" = 2 THEN 'pro'
  ELSE 'starter'
END
FROM "SaasPackage" p
WHERE c."packageId" = p."id";

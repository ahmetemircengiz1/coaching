ALTER TABLE "Coach"
ADD COLUMN "hero_image_original_url" TEXT,
ADD COLUMN "hero_image_desktop_url" TEXT,
ADD COLUMN "hero_image_mobile_url" TEXT,
ADD COLUMN "hero_image_blur_data_url" TEXT,
ADD COLUMN "hero_focal_y" INTEGER NOT NULL DEFAULT 35,
ADD COLUMN "hero_focal_x" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN "hero_mode" TEXT NOT NULL DEFAULT 'photo';

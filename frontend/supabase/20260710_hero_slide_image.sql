-- Hero slide 1: construction engineers at site (no US branding)
UPDATE public.hero_slides
SET
  image = 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
  updated_at = now()
WHERE order_index = 1;

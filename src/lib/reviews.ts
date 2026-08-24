import { Testimonial } from '../types';

const STORAGE_KEY = 'ssr_testimonials';

export const getStoredTestimonials = (): Testimonial[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Testimonial[];
  } catch (err) {
    console.error('Failed to read testimonials from storage', err);
    return [];
  }
};

const dispatchChangeEvent = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ssr-reviews-changed'));
  }
};

export const saveStoredTestimonials = (items: Testimonial[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    dispatchChangeEvent();
  } catch (err) {
    console.error('Failed to save testimonials to storage', err);
  }
};

export const addTestimonial = (t: Testimonial) => {
  const list = getStoredTestimonials();
  list.unshift(t);
  saveStoredTestimonials(list);
  return list;
};

export const updateTestimonial = (id: string, data: Partial<Testimonial>) => {
  const list = getStoredTestimonials();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return list;
  list[idx] = { ...list[idx], ...data };
  saveStoredTestimonials(list);
  return list;
};

export const deleteTestimonial = (id: string) => {
  let list = getStoredTestimonials();
  list = list.filter(x => x.id !== id);
  saveStoredTestimonials(list);
  return list;
};

import {CalendarEvent} from "@cut/api/types";

const orgImageMap: { [key: string]: string } = {
  'DSA': 'assets/DSA.jpg',
  'Democratic Socialists': 'assets/DSA.jpg',
  'PSL': 'assets/psl.jpg',
  'Party for Socialism': 'assets/psl.jpg',
  'Brown Berets': 'assets/BrownBerets.png',
  'SLC Mutual Aid': 'assets/SLCMutualAid.png',
  'Mutual Aid': 'assets/SLCMutualAid.png',
  'Wild Utah': 'assets/WildUtah.png',
  'Indivisible': 'assets/indivisible.png',
  'Beehive Collective': 'assets/beehiveCollectivePlaceholder.jpg',
  'Bakers for Palestine': 'assets/bakers_for_palestine_SLC.jpg'
};

export const getEventImage = (event: CalendarEvent) => {
  if (event.image) return event.image;
  if (event.source === 'google') {
    const searchText = `${event.title} ${event.description || ''}`.toLowerCase();

    for (const [org, imagePath] of Object.entries(orgImageMap)) {
      if (searchText.includes(org.toLowerCase())) {
        return imagePath;
      }
    }
  }

  return 'assets/placeholder.jpg';
};

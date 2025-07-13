// /lib/services/ProfileService.ts
import { Firestore, collection, getDocs, updateDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { ProfileModel } from '~/lib/models/ProfileModel'; // Ensure the correct path
import { PhotoService } from '~/lib/services/PhotoService'; // Ensure you import the PhotoService to fetch photo URLs
import { ArchetypeModel, RelationshipGoalModel } from '~/lib/models/ArchetypeModel';

export class ProfileService {
  private firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  // Fetch all profiles
  async getProfiles(): Promise<ProfileModel[]> {
    try {
      const profilesCollection = collection(this.firestore, 'profiles');
      const profileSnapshot = await getDocs(profilesCollection);

      // Explicitly map to ProfileModel
      return profileSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId || '',
          selectedArchetypes: data.selectedArchetypes || [],
          selectedRelationshipGoals: data.selectedRelationshipGoals || [],
          profilePhotos: data.profilePhotos || { primaryPhotoId: '', candidPhotoIds: [] },
          appearancePhysical: data.appearancePhysical || { bodyType: '', lifestyleActivities: [] },
          confidenceAndPositivity: data.confidenceAndPositivity || { confidenceLevel: 0, positiveTraits: [] },
          communicationStyles: data.communicationStyles || [],
          bio: data.bio || '',
          personalityValues: data.personalityValues || { coreValues: [], humorImportance: 50, intellectualImportance: 50 },
          socialProofAndTestimonials: data.socialProofAndTestimonials || { testimonial: '', compliments: [] },
          timestamp: data.timestamp || new Date().toISOString(),
          voteCount: data.voteCount || { totalVotes: 0, confident: 0, nicePersonality: 0, attractive: 0 },
          sumTraits: data.sumTraits || { confident: 0, nicePersonality: 0, attractive: 0 },
          status: data.status || 'Inactive',
        } as ProfileModel;
      });
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  }

  // Fetch all profiles along with photo URLs
  async getProfilesWithPhotoUrls(): Promise<ProfileModel[]> {
    try {
      const profiles = await this.getProfiles();
      const photoService = new PhotoService(this.firestore);

      // Fetch photo URLs based on document IDs
      const updatedProfiles = await Promise.all(
        profiles.map(async (profile) => {
          if (profile.profilePhotos?.primaryPhotoId) {
            // Fetch primary photo URL using its document ID
            const primaryPhotoDoc = await photoService.getPhotoById(profile.profilePhotos.primaryPhotoId);
            if (primaryPhotoDoc?.imageURL) {
              profile.profilePhotos.primaryPhotoURL = primaryPhotoDoc.imageURL;
            }
          }

          if (profile.profilePhotos?.candidPhotoIds) {
            // Fetch candid photos URLs using their document IDs
            profile.profilePhotos.candidPhotoURLs = await Promise.all(
              profile.profilePhotos.candidPhotoIds.map(async (photoId) => {
                const photoDoc = await photoService.getPhotoById(photoId);
                return photoDoc?.imageURL || null; // Return URL or null if not found
              })
            ).then((urls) => urls.filter((url) => url !== null)); // Remove null values
          }

          return profile;
        })
      );

      return updatedProfiles;
    } catch (error) {
      console.error('Error fetching profiles with photo URLs:', error);
      throw error;
    }
  }

  // Update profile status (start/stop review)
  async updateProfileStatus(profileId: string, status: string): Promise<void> {
    try {
      const profileRef = doc(this.firestore, 'profiles', profileId);
      await updateDoc(profileRef, { status });
      console.log(`Profile ${profileId} status updated to ${status}`);
    } catch (error) {
      console.error('Error updating profile status:', error);
      throw error;
    }
  }

  // Create or update a profile
  async createOrUpdateProfile(userId: string, profileData: Partial<ProfileModel>): Promise<void> {
    try {
      const profileRef = doc(this.firestore, 'profiles', userId);
  
      // Transform selectedArchetypes and selectedRelationshipGoals to match the expected data model
      const transformedProfileData = {
        ...profileData,
        selectedArchetypes: profileData.selectedArchetypes?.map((archetype: any) => ({
          id: archetype.id || '',
          name: archetype.name || '',
          traits: (archetype.traits || []).map((trait: any) => {
            // Ensure traits are of type TraitModel
            return typeof trait === 'string'
              ? { trait, influenceWeight: 0 }
              : { ...trait };
          }),
          visualCues: archetype.visualCues || [],
          relationshipGoals: (archetype.relationshipGoals || []).map((goal: any) => ({
            id: goal.id || '',
            name: goal.name || '',
            relatedTraits: (goal.relatedTraits || []).map((relatedTrait: any) => {
              // Ensure relatedTraits are of type TraitModel
              return typeof relatedTrait === 'string'
                ? { trait: relatedTrait, influenceWeight: 0 }
                : { ...relatedTrait };
            }),
            description: goal.description || '',
          })),
          description: archetype.description || '',
        })) || [],
        selectedRelationshipGoals: profileData.selectedRelationshipGoals?.map((goal: any) => ({
          id: goal.id || '',
          name: goal.name || '',
          relatedTraits: (goal.relatedTraits || []).map((relatedTrait: any) => {
            // Ensure relatedTraits are of type TraitModel
            return typeof relatedTrait === 'string'
              ? { trait: relatedTrait, influenceWeight: 0 }
              : { ...relatedTrait };
          }),
          description: goal.description || '',
        })) || [],
      };
  
      // Use setDoc with merge to avoid overwriting existing fields
      await setDoc(profileRef, transformedProfileData, { merge: true });
  
      console.log(`Profile for user ${userId} successfully saved/updated`);
    } catch (error) {
      console.error('Error saving/updating profile:', error);
      throw error;
    }
  }

  // Get a specific profile by ID
  async getProfileById(profileId: string): Promise<ProfileModel | null> {
    try {
      const profileRef = doc(this.firestore, 'profiles', profileId);
      const profileDoc = await getDoc(profileRef);

      if (profileDoc.exists()) {
        const data = profileDoc.data();
        return {
          id: profileDoc.id,
          userId: data.userId || '',
          selectedArchetypes: data.selectedArchetypes || [],
          selectedRelationshipGoals: data.selectedRelationshipGoals || [],
          profilePhotos: data.profilePhotos || { primaryPhotoId: '', candidPhotoIds: [] },
          appearancePhysical: data.appearancePhysical || { bodyType: '', lifestyleActivities: [] },
          confidenceAndPositivity: data.confidenceAndPositivity || { confidenceLevel: 0, positiveTraits: [] },
          communicationStyles: data.communicationStyles || [],
          bio: data.bio || '',
          personalityValues: data.personalityValues || { coreValues: [], humorImportance: 50, intellectualImportance: 50 },
          socialProofAndTestimonials: data.socialProofAndTestimonials || { testimonial: '', compliments: [] },
          timestamp: data.timestamp || new Date().toISOString(),
          voteCount: data.voteCount || { totalVotes: 0, confident: 0, nicePersonality: 0, attractive: 0 },
          sumTraits: data.sumTraits || { confident: 0, nicePersonality: 0, attractive: 0 },
          status: data.status || 'Inactive',
        } as ProfileModel;
      } else {
        console.log(`Profile ${profileId} does not exist`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching profile by ID:', error);
      throw error;
    }
  }
}
import { CatalogueInterface } from "@utils/interfaces";
import { TouristGuideInterface } from "./tourist-guide.interface";

export interface CtcInterface {
  processId: string;
  type: CatalogueInterface;
  activity: { id: string };
  classification: { id: string };
  category: { id: string };
  localType: { id: string };
  accommodation: AccommodationInterface;
  foodDrink: FoodDrinkInterface;
  hasPropertyRegistrationCertificate: boolean;
  hasStatute: boolean;
  hasTechnicalReport: boolean;
  communityOperation: CommunityOperationInterface;
  touristTransportCompany: TouristTransportCompanyInterface;
}

export interface AccommodationInterface {
  totalRooms: number;
  totalBeds: number;
  totalPlaces: number;
}

export interface FoodDrinkInterface {
  totalTables: number;
  totalCapacities: number;
}

export interface CommunityOperationInterface {
  hasGuide: boolean;
  touristGuides: TouristGuideInterface[];
}

export interface TouristTransportCompanyInterface {
  hasTransports: boolean;
  transports: TransportInterface[];
}

export interface TransportInterface {
  authorizationNumber: number;
  ruc: number;
  rucType: string;
  socialReason: string;
  type: string;
}

export interface IssueRequest {
  context: Context;
  message: Message;
}

export interface Context {
  bpp_id: any;
  bpp_uri: any;
  transaction_id: string;
  city: string;
  state: string;
  domain:string
}

export interface Message {
  issue: IssueProps;
}

export interface IssueProps {
  category: string;
  sub_category: string;
  bppId: string;
  bpp_uri: string;
  complainant_info: ComplainantInfo;
  order_details: OrderDetails;
  description: Description;
  issue_actions: IssueActions;
  created_at: Date;
  updated_at: Date;
  issueId?: string;
  id?: string;
  issue_status: string;
  resolution: Object;
  resolution_provider: Object;
  status: string;
  rating?: string;
  issue_type?: string;
  short_desc?: string
}

export interface ComplainantInfo {
  person: Person;
  contact: ComplainantInfoContact;
}

export interface ComplainantInfoContact {
  phone: string;
  email?: string;
}

export interface Person {
  name: string;
}

export interface Description {
  short_desc: string;
  long_desc: string;
  additional_desc: AdditionalDesc;
  images: string[];
}

export interface AdditionalDesc {
  url: string;
  content_type: string;
}

export interface IssueActions {
  complainant_actions: ComplainantAction[];
  respondent_actions: RespondentActions[];
}
export interface RespondentActions {
  respondent_action: string;
  short_desc: string;
  updated_at: Date;
  updated_by: UpdatedBy;
  cascaded_level: number;
}

export interface Org {
  name: string;
}

export interface ComplainantAction {
  complainant_action: string;
  short_desc: string;
  updated_at: Date;
  updated_by: UpdatedBy;
}

export interface UpdatedBy {
  org: Person;
  contact: UpdatedByContact;
  person: Person;
}

export interface UpdatedByContact {
  phone: string;
  email?: string;
}

export interface OrderDetails {
  id: string;
  state: string;
  items: Item[];
  fulfillments: Fulfillment[];
  provider_id: string;
}

export interface Fulfillment {
  id: string;
  type: string;
  tracking: boolean;
  start: Start;
  end: End;
  customer: Customer;
  state: any;
}

export interface Customer {
  person: Person;
}

export interface End {
  location: EndLocation;
  time: Time;
  instructions: Instructions;
  contact: UpdatedByContact;
}

export interface Instructions {
  name: string;
  images: any[];
}

export interface EndLocation {
  gps: string;
  address: Address;
}

export interface Address {
  door: string;
  name: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  areaCode: string;
}

export interface Time {
  range: Range;
}

export interface Range {
  start: Date;
  end: Date;
}

export interface Start {
  location: StartLocation;
  time: Time;
  instructions: Instructions;
  contact: UpdatedByContact;
}

export interface StartLocation {
  id: string;
  descriptor: Instructions;
  gps: string;
}

export interface Item {
  id: string;
  quantity: Quantity;
  product: Product;
}

export interface Product {
  id: string;
  descriptor: Person;
  location_id: string;
  price: Price;
  matched: boolean;
  provider_details: ProviderDetails;
  location_details: LocationDetails;
  bpp_details: BppDetails;
}

export interface BppDetails {
  name: string;
  bpp_id: string;
}

export interface LocationDetails {
  id: string;
  gps: string;
}

export interface Price {
  currency: string;
  value: string;
}

export interface ProviderDetails {
  id: string;
  descriptor: Person;
}

export interface Quantity {
  count: number;
}

export interface UserDetails {
  decodedToken: DecodedToken;
  token: string;
}

export interface OrderId {
  orderId: string;
}

export interface DecodedToken {
  name: string;
  picture: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  firebase: Firebase;
  uid: string;
}

export interface Firebase {
  identities: Identities;
  sign_in_provider: string;
}

export interface Identities {
  "google.com": string[];
  email: string[];
}

export interface IResponseProps {
  type: string;
  data: Buffer;
}
export interface IParamProps {
  limit: number;
  pageNumber: number;
}

export interface IssueRequestPayload {
  context: Context;
  message: Message;
}

export interface RequestContext {
  domain: string;
  country: string;
  city: string;
  action: string;
  core_version: string;
  bap_id: string;
  bap_uri: string;
  bpp_uri: string;
  transaction_id: string;
  message_id: string;
  timestamp: Date;
  bpp_id: string;
  ttl: string;
}

export interface Message {
  ack?: ACK;
}

export interface ACK {
  status?: string;
}

export interface Response {
  message?: Message;
}

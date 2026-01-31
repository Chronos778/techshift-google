/**
 * Mock Data for Smart City Issue Reporter
 * This data simulates what would come from Firestore in production
 */

export const mockIssues = [
  {
    id: 'issue_001',
    type: 'pothole',
    status: 'pending',
    description: 'Large pothole on Main Street near the intersection with Oak Avenue. Approximately 40cm wide and 15cm deep. Poses significant hazard to vehicles and cyclists.',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '123 Main Street, San Francisco, CA 94102',
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800',
    createdAt: new Date('2024-12-24T10:30:00'),
    updatedAt: new Date('2024-12-24T10:30:00'),
    reportedBy: 'Anonymous',
    aiConfidence: 0.92,
    timeline: [
      { status: 'reported', timestamp: new Date('2024-12-24T10:30:00'), note: 'Issue reported via mobile app' },
    ],
  },
  {
    id: 'issue_002',
    type: 'streetlight',
    status: 'in-progress',
    description: 'Street light at corner of Market and Castro has been flickering for the past week and is now completely out. Creates unsafe conditions for pedestrians at night.',
    location: {
      lat: 37.7621,
      lng: -122.4350,
      address: '456 Market Street, San Francisco, CA 94103',
    },
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    createdAt: new Date('2024-12-22T18:45:00'),
    updatedAt: new Date('2024-12-25T09:00:00'),
    reportedBy: 'Anonymous',
    aiConfidence: 0.88,
    timeline: [
      { status: 'reported', timestamp: new Date('2024-12-22T18:45:00'), note: 'Issue reported via mobile app' },
      { status: 'acknowledged', timestamp: new Date('2024-12-23T08:00:00'), note: 'Issue acknowledged by Public Works' },
      { status: 'in-progress', timestamp: new Date('2024-12-25T09:00:00'), note: 'Maintenance crew dispatched' },
    ],
  },
  {
    id: 'issue_003',
    type: 'graffiti',
    status: 'resolved',
    description: 'Graffiti vandalism on the side of the community center building. Multiple spray paint tags covering approximately 3 square meters.',
    location: {
      lat: 37.7849,
      lng: -122.4094,
      address: '789 Valencia Street, San Francisco, CA 94110',
    },
    imageUrl: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800',
    createdAt: new Date('2024-12-20T14:20:00'),
    updatedAt: new Date('2024-12-26T11:30:00'),
    reportedBy: 'Anonymous',
    aiConfidence: 0.95,
    timeline: [
      { status: 'reported', timestamp: new Date('2024-12-20T14:20:00'), note: 'Issue reported via mobile app' },
      { status: 'acknowledged', timestamp: new Date('2024-12-21T09:15:00'), note: 'Issue acknowledged by Parks Dept' },
      { status: 'in-progress', timestamp: new Date('2024-12-24T07:00:00'), note: 'Cleaning crew assigned' },
      { status: 'resolved', timestamp: new Date('2024-12-26T11:30:00'), note: 'Graffiti removed successfully' },
    ],
  },
  {
    id: 'issue_004',
    type: 'garbage',
    status: 'pending',
    description: 'Illegal dumping of furniture and household items in alley behind apartment complex. Blocking access and attracting pests.',
    location: {
      lat: 37.7699,
      lng: -122.4469,
      address: '321 Haight Street, San Francisco, CA 94117',
    },
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    createdAt: new Date('2024-12-25T16:00:00'),
    updatedAt: new Date('2024-12-25T16:00:00'),
    reportedBy: 'Anonymous',
    aiConfidence: 0.91,
    timeline: [
      { status: 'reported', timestamp: new Date('2024-12-25T16:00:00'), note: 'Issue reported via mobile app' },
    ],
  },
  {
    id: 'issue_005',
    type: 'flooding',
    status: 'in-progress',
    description: 'Persistent water pooling at intersection due to blocked storm drain. Water depth reaches 6 inches during rain, causing traffic hazards.',
    location: {
      lat: 37.7599,
      lng: -122.4148,
      address: '555 Mission Street, San Francisco, CA 94105',
    },
    imageUrl: 'https://images.unsplash.com/photo-1446034295857-c39f8844fad4?w=800',
    createdAt: new Date('2024-12-23T08:30:00'),
    updatedAt: new Date('2024-12-26T10:00:00'),
    reportedBy: 'Anonymous',
    aiConfidence: 0.87,
    timeline: [
      { status: 'reported', timestamp: new Date('2024-12-23T08:30:00'), note: 'Issue reported via mobile app' },
      { status: 'acknowledged', timestamp: new Date('2024-12-24T07:45:00'), note: 'Issue acknowledged by DPW' },
      { status: 'in-progress', timestamp: new Date('2024-12-26T10:00:00'), note: 'Drainage team investigating' },
    ],
  },
  {
    id: 'issue_006',
    type: 'road-damage',
    status: 'pending',
    description: 'Multiple cracks and uneven surface on bike lane. Surface degradation creating dangerous conditions for cyclists.',
    location: {
      lat: 37.7829,
      lng: -122.3957,
      address: '101 Embarcadero, San Francisco, CA 94111',
    },
    imageUrl: 'https://images.unsplash.com/photo-1597766659890-4aec04d79a3f?w=800',
    createdAt: new Date('2024-12-26T07:15:00'),
    updatedAt: new Date('2024-12-26T07:15:00'),
    reportedBy: 'Anonymous',
    aiConfidence: 0.84,
    timeline: [
      { status: 'reported', timestamp: new Date('2024-12-26T07:15:00'), note: 'Issue reported via mobile app' },
    ],
  },
  {
    id: 'issue_007',
    type: 'tree',
    status: 'resolved',
    description: 'Large branch fallen across sidewalk after windstorm. Blocking pedestrian path and partially extending into street.',
    location: {
      lat: 37.7719,
      lng: -122.4536,
      address: '888 Golden Gate Ave, San Francisco, CA 94102',
    },
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    createdAt: new Date('2024-12-21T22:00:00'),
    updatedAt: new Date('2024-12-22T16:30:00'),
    reportedBy: 'Anonymous',
    aiConfidence: 0.96,
    timeline: [
      { status: 'reported', timestamp: new Date('2024-12-21T22:00:00'), note: 'Issue reported via mobile app' },
      { status: 'acknowledged', timestamp: new Date('2024-12-22T06:00:00'), note: 'Emergency response initiated' },
      { status: 'in-progress', timestamp: new Date('2024-12-22T08:30:00'), note: 'Crew on site' },
      { status: 'resolved', timestamp: new Date('2024-12-22T16:30:00'), note: 'Branch removed and disposed' },
    ],
  },
  {
    id: 'issue_008',
    type: 'pothole',
    status: 'in-progress',
    description: 'Series of small potholes along bus route. Multiple complaints from transit riders about rough ride quality.',
    location: {
      lat: 37.7879,
      lng: -122.4074,
      address: '200 Geary Street, San Francisco, CA 94102',
    },
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    createdAt: new Date('2024-12-19T11:20:00'),
    updatedAt: new Date('2024-12-26T08:00:00'),
    reportedBy: 'Anonymous',
    aiConfidence: 0.89,
    timeline: [
      { status: 'reported', timestamp: new Date('2024-12-19T11:20:00'), note: 'Issue reported via mobile app' },
      { status: 'acknowledged', timestamp: new Date('2024-12-20T09:00:00'), note: 'Added to repair schedule' },
      { status: 'in-progress', timestamp: new Date('2024-12-26T08:00:00'), note: 'Repair work started' },
    ],
  },
]

export const mockStats = {
  totalReported: 1247,
  resolvedThisMonth: 342,
  averageResolutionTime: '3.2 days',
  activeReports: 89,
}

export const issueTypes = [
  { id: 'pothole', label: 'Pothole', icon: '🕳️', color: 'orange' },
  { id: 'streetlight', label: 'Broken Streetlight', icon: '💡', color: 'yellow' },
  { id: 'graffiti', label: 'Graffiti', icon: '🎨', color: 'purple' },
  { id: 'garbage', label: 'Garbage/Litter', icon: '🗑️', color: 'green' },
  { id: 'road-damage', label: 'Road Damage', icon: '🚧', color: 'red' },
  { id: 'flooding', label: 'Flooding', icon: '🌊', color: 'blue' },
  { id: 'tree', label: 'Fallen Tree', icon: '🌳', color: 'green' },
  { id: 'other', label: 'Other', icon: '📍', color: 'gray' },
]

export default {
  mockIssues,
  mockStats,
  issueTypes,
}

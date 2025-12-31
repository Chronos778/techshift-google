// List of email addresses that have Admin privileges
// Add your Google account email here to access the dashboard
const ADMIN_EMAILS = [
    "maithilpatil9@gmail.com",
    "admin@smartcity.com"
];

/**
 * Checks if the given user object has admin privileges.
 * @param {object} user - The Firebase user object.
 * @returns {boolean} - True if admin, false otherwise.
 */
export const isAdmin = (user) => {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email);
};


export const getUserRole = (user) => {
    return isAdmin(user) ? 'admin' : 'citizen';
};

// Gamification Logic
export const POINTS_PER_ACTION = {
    REPORT_SUBMITTED: 10,
    REPORT_VERIFIED: 50, // Bonus for good reporting
    REPORT_RESOLVED: 20,
};

export const BADGES = {
    GUARDIAN: { id: 'guardian', label: 'City Guardian', icon: '🛡️', threshold: 500 },
    SUPER_CITIZEN: { id: 'super_citizen', label: 'Super Citizen', icon: '🌟', threshold: 1000 },
    POTHOLE_PATROL: { id: 'pothole_patrol', label: 'Pothole Patrol', icon: '🚧', threshold: 5 }, // 5 pothole reports
};

export const getLevel = (points) => {
    return Math.floor(points / 100) + 1;
};

export const getNextLevelProgress = (points) => {
    const currentLevel = getLevel(points);
    const nextLevelPoints = currentLevel * 100;
    const currentLevelPoints = (currentLevel - 1) * 100;
    return ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
};


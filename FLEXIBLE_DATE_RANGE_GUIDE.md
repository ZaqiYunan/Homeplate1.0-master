# 📅 Flexible Date Range for Expiry Notifications

## What Changed

The email notification system now supports **flexible date ranges** instead of being fixed at 3 days.

### New Features:

🔧 **Configurable Range**: Set anywhere from 1 day to 30 days ahead
📊 **Smart Categorization**: Ingredients grouped by urgency
🎨 **Color-coded Emails**: Visual priority in HTML emails
📱 **Better Messaging**: Dynamic content based on urgency

## How It Works

### Default Behavior:
- **7 days ahead** (increased from 3 days)
- Catches more ingredients before they expire
- Gives users more time to plan

### Urgency Categories:

1. **🚨 URGENT** (Red) - Expires today/tomorrow
2. **⚠️ SOON** (Orange) - Expires within 3 days  
3. **📋 LATER** (Blue) - Expires in 4+ days

## How to Use Different Date Ranges

### Method 1: Default (7 days)
Just click "Send Test Email" - uses 7 days automatically

### Method 2: Custom Range via Admin Panel
When triggering notifications, you can specify:
```javascript
// In browser console or admin panel
await supabase.functions.invoke('expiry-notifications', {
  body: { daysAhead: 14 } // Check 14 days ahead
});
```

### Method 3: Common Scenarios

**Weekly Check (7 days):**
```javascript
{ daysAhead: 7 }  // Default
```

**Bi-weekly Check (14 days):**
```javascript
{ daysAhead: 14 }
```

**Monthly Check (30 days):**
```javascript
{ daysAhead: 30 }
```

**Emergency Check (1 day):**
```javascript
{ daysAhead: 1 }  // Only today/tomorrow
```

## Email Examples

### 7-Day Range Email:
```
Subject: 🚨 5 ingredient(s) expiring within 7 days!

🚨 URGENT (expires today/tomorrow):
• Milk (expires: 2025-07-18)
• Bread (expires: 2025-07-19)

⚠️ Soon (expires within 3 days):
• Yogurt (expires: 2025-07-20)
• Cheese (expires: 2025-07-21)

📋 Later (expires in 4+ days):
• Apples (expires: 2025-07-24)
```

### 14-Day Range Email:
```
Subject: 🚨 8 ingredient(s) expiring within 14 days!

📋 Upcoming expiry dates to be aware of.
```

## User Notification Preferences

Users can still set their individual preferences:
- **Personal range**: 1-30 days (overrides default)
- **Enable/disable**: Turn notifications on/off
- **Time preference**: When to receive emails

The system respects both:
1. **Global range** (set by admin/function call)
2. **User preferences** (individual settings)

## Benefits of Longer Ranges

### 7+ Days Ahead:
✅ **Better planning** - Users can meal plan effectively
✅ **Reduced waste** - More time to use ingredients
✅ **Bulk notifications** - Fewer individual emails
✅ **Recipe suggestions** - Time to find recipes using expiring items

### 1-3 Days (Urgent):
✅ **Immediate action** - Use now or lose
✅ **Critical alerts** - Don't miss anything

## Testing Different Ranges

### Test 1: Short Range (1 day)
```javascript
// Only urgent items
await supabase.functions.invoke('expiry-notifications', {
  body: { daysAhead: 1 }
});
```

### Test 2: Medium Range (7 days - default)
```javascript
// Balanced approach
// Just click "Send Test Email" 
```

### Test 3: Long Range (30 days)
```javascript
// Monthly overview
await supabase.functions.invoke('expiry-notifications', {
  body: { daysAhead: 30 }
});
```

## Implementation Details

### Database Query:
- Searches ingredients with `expiry_date <= (today + daysAhead)`
- Respects user notification preferences
- Prevents duplicate notifications within 24 hours

### Email Content:
- Dynamic subject line includes range
- Color-coded HTML sections
- Urgency messaging adapts to content

### Logging:
- Records the range used for each notification
- Tracks which ingredients were included
- Maintains audit trail

## Recommendation

**Start with 7 days** (new default) and adjust based on user feedback:
- Too many emails? Reduce to 3-5 days
- Missing urgent items? Users want shorter range
- Want meal planning help? Increase to 10-14 days

The flexible system lets you optimize for your users' needs! 🎯

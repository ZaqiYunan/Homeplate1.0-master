# 📅 Extended Date Range: Beyond 3 Days

## What Changed

Updated the email notification system to catch ingredients **beyond 3 days** for better meal planning.

### Key Updates:

🔢 **Default Range**: 14 days (was 7 days)
📊 **4 Categories** instead of 3:
- 🚨 **URGENT**: Today/tomorrow (1 day)
- ⚠️ **SOON**: 2-3 days
- 📅 **THIS WEEK**: 4-7 days 
- 📋 **NEXT WEEK+**: 8+ days

## Benefits of 14-Day Range

### 🍳 **Better Meal Planning:**
- See what expires next week and beyond
- Plan multiple meals in advance
- Reduce food waste significantly

### 📋 **Complete Overview:**
- Catch ingredients you might forget about
- Better inventory management
- Plan shopping around what you have

### 💡 **Smart Usage Tips:**
- Prioritize by color coding
- Use urgent items first
- Plan recipes using medium-term items

## Example Email (14-Day Range):

```
🚨 8 ingredient(s) expiring within 14 days!

📅 Some ingredients expire within a week.

🚨 URGENT (expires today/tomorrow):
• Milk (expires: 2025-07-18)

⚠️ Soon (expires within 3 days):
• Yogurt (expires: 2025-07-20)
• Cheese (expires: 2025-07-21)

📅 This Week (expires in 4-7 days):
• Bread (expires: 2025-07-23)
• Lettuce (expires: 2025-07-24)

📋 Next Week+ (expires in 8+ days):
• Apples (expires: 2025-07-28)
• Carrots (expires: 2025-07-30)
• Rice (expires: 2025-08-01)

💡 Tip: Use ingredients in order of urgency for best meal planning!
```

## Customizable Ranges

### Quick Options:
- **3 days**: `{ daysAhead: 3 }` (old behavior)
- **7 days**: `{ daysAhead: 7 }` (weekly check)
- **14 days**: Default (bi-weekly planning)
- **30 days**: `{ daysAhead: 30 }` (monthly overview)

### Test Different Ranges:
```javascript
// Test weekly range
await supabase.functions.invoke('expiry-notifications', {
  body: { daysAhead: 7 }
});

// Test monthly range
await supabase.functions.invoke('expiry-notifications', {
  body: { daysAhead: 30 }
});
```

## Perfect For:

✅ **Meal Preppers**: Plan entire weeks
✅ **Busy Families**: Don't forget anything
✅ **Food Conscious**: Minimize waste
✅ **Recipe Planners**: Use what you have

The 14-day default gives users a complete picture while still highlighting urgent items! 🎯

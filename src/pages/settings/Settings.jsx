import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const Settings = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [settings, setSettings] = useState({
    companyName: 'Your Company',
    supportEmail: 'support@company.com',
    defaultCurrency: 'USD',
    notifyOnNewInfluencer: true,
    notifyOnNewVendor: true,
    autoApproveContent: false,
    minimumFollowers: 5000,
    minimumEngagementRate: 2.5,
  });

  const [users] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'Moderator',
      status: 'Active',
    },
  ]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings({
      ...settings,
      [setting]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Card>
        <CardContent>
          <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="General Settings" />
            <Tab label="Notifications" />
            <Tab label="User Management" />
            <Tab label="Platform Settings" />
          </Tabs>

          {/* General Settings */}
          {currentTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={settings.companyName}
                  onChange={handleSettingChange('companyName')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Support Email"
                  value={settings.supportEmail}
                  onChange={handleSettingChange('supportEmail')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Default Currency</InputLabel>
                  <Select
                    value={settings.defaultCurrency}
                    label="Default Currency"
                    onChange={handleSettingChange('defaultCurrency')}
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Notifications */}
          {currentTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifyOnNewInfluencer}
                      onChange={handleSettingChange('notifyOnNewInfluencer')}
                    />
                  }
                  label="Notify on new influencer registration"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifyOnNewVendor}
                      onChange={handleSettingChange('notifyOnNewVendor')}
                    />
                  }
                  label="Notify on new vendor registration"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoApproveContent}
                      onChange={handleSettingChange('autoApproveContent')}
                    />
                  }
                  label="Auto-approve content from verified influencers"
                />
              </Grid>
            </Grid>
          )}

          {/* User Management */}
          {currentTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddUserDialog(true)}
                >
                  Add User
                </Button>
              </Box>
              <List>
                {users.map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <>
                          {user.email} • {user.role} • {user.status}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Platform Settings */}
          {currentTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Followers Required"
                  value={settings.minimumFollowers}
                  onChange={handleSettingChange('minimumFollowers')}
                  InputProps={{
                    endAdornment: <Typography>followers</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Engagement Rate"
                  value={settings.minimumEngagementRate}
                  onChange={handleSettingChange('minimumEngagementRate')}
                  InputProps={{
                    endAdornment: <Typography>%</Typography>,
                  }}
                />
              </Grid>
            </Grid>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog
        open={addUserDialog}
        onClose={() => setAddUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select label="Role">
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setAddUserDialog(false)}>
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;

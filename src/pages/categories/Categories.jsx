import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Autocomplete
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { apiService } from '../../api/apiwrapper';
import { toast } from 'react-toastify';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentId: '',
        relatedCategoryIds: null,
        image: null
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await apiService.get('/category');
            setCategories(response.data);
        } catch (error) {
            toast.error('Failed to fetch categories');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            image: file
        }));
    };

    const handleRelatedCategoriesChange = (event, values) => {
        setFormData(prev => ({
            ...prev,
            relatedCategoryIds: values.map(v => v.id).join(',')
        }));
    };

    const handleOpenDialog = (category = null) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({
                name: category.name,
                description: category.description,
                parentId: category.parent?.id || '',
                relatedCategoryIds: category.relatedCategoryIds || null,
                image: category.image
            });
        } else {
            setSelectedCategory(null);
            setFormData({
                name: '',
                description: '',
                parentId: '',
                relatedCategoryIds: null,
                image: null
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
        setFormData({
            name: '',
            description: '',
            parentId: '',
            relatedCategoryIds: null,
            image: null
        });
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            if (formData.parentId) {
                formDataToSend.append('parentId', formData.parentId);
            }
            if (formData.relatedCategoryIds) {
                formDataToSend.append('relatedCategoryIds', formData.relatedCategoryIds);
            }
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            if (selectedCategory) {
                await apiService.patch(`/category/${selectedCategory.id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Category updated successfully');
            } else {
                await apiService.post('/category', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Category created successfully');
            }
            handleCloseDialog();
            fetchCategories();
        } catch (error) {
            toast.error(selectedCategory ? 'Failed to update category' : 'Failed to create category');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await apiService.delete(`/category/${id}`);
                toast.success('Category deleted successfully');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete category');
                console.error(error);
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Categories
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Category
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Parent Category</TableCell>
                                <TableCell>Related Categories</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell>
                                        <Box
                                            component="img"
                                            sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                                            src={category.image}
                                            alt={category.name}
                                        />
                                    </TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.description}</TableCell>
                                    <TableCell>
                                        {category.parent?.name || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {category.relatedCategories?.map(cat => cat.name).join(', ') || '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpenDialog(category)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(category.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedCategory ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Parent Category</InputLabel>
                            <Select
                                value={formData.parentId}
                                name="parentId"
                                onChange={handleInputChange}
                                label="Parent Category"
                            >
                                <MenuItem value="">None</MenuItem>
                                {categories
                                    .filter(category => !selectedCategory || category.id !== selectedCategory.id)
                                    .map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <Autocomplete
                            multiple
                            options={categories.filter(category => !selectedCategory || category.id !== selectedCategory.id)}
                            getOptionLabel={(option) => option.name}
                            value={categories.filter(cat =>
                                formData.relatedCategoryIds?.split(',').map(Number).includes(cat.id) &&
                                (!selectedCategory || cat.id !== selectedCategory.id)
                            )}
                            onChange={handleRelatedCategoriesChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Related Categories"
                                    margin="normal"
                                />
                            )}
                        />
                        <TextField
                            fullWidth
                            type="file"
                            label="Image"
                            name="image"
                            onChange={handleImageChange}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedCategory ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Categories;

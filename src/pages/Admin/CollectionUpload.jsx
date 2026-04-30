import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Table,
  Button,
  Input,
  Form,
  Card,
  Tag,
  Drawer,
  Space,
  message,
  DatePicker,
  InputNumber,
  Statistic,
  Row,
  Col,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function CollectionUpload() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form] = Form.useForm();

  const loadCollections = async () => {
    setLoading(true);
    try {
      const res = await API.get("/collections");
      setCollections(res.data);
    } catch (err) {
      message.error("Failed to load collections");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const openAddDrawer = () => {
    setEditingItem(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEditDrawer = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      nextRenewalDate: record.nextRenewalDate ? dayjs(record.nextRenewalDate) : null,
    });
    setDrawerOpen(true);
  };

  // 🔥 ADVANCED STATUS LOGIC (based on currentStock)
  const getStatus = (currentStock, initialStock) => {
    if (currentStock === 0) return "Out of Stock";
    if (currentStock <= initialStock * 0.2) return "Critical Stock";
    if (currentStock <= initialStock * 0.5) return "Low Stock";
    if (currentStock >= initialStock) return "Full Stock";
    return "In Stock";
  };

  // 🎨 STATUS COLOR UI
  const getTagColor = (status) => {
    const colors = {
      "Out of Stock": "red",
      "Critical Stock": "darkred",
      "Low Stock": "orange",
      "In Stock": "blue",
      "Full Stock": "green",
    };
    return colors[status] || "default";
  };

  // 📦 UPDATE STOCK (Increment/Decrement)
  const updateStock = async (id, currentStock, change) => {
    const newStock = Math.max(0, currentStock + change);
    try {
      const item = collections.find(c => c._id === id);
      const newStatus = getStatus(newStock, item.initialStock);
      
      await API.put(`/collections/${id}`, {
        ...item,
        currentStock: newStock,
        type: newStatus,
      });
      message.success(`Stock ${change > 0 ? 'increased' : 'decreased'} to ${newStock}`);
      loadCollections();
    } catch (err) {
      message.error("Stock update failed");
    }
  };

  const onFinish = async (values) => {
    try {
      const initialStock = Number(values.initialStock);
      const currentStock = Number(values.currentStock) || initialStock;
      const status = getStatus(currentStock, initialStock);

      const payload = {
        productName: values.productName,
        collectionName: values.collectionName,
        initialStock: initialStock,
        currentStock: currentStock,
        unitPrice: Number(values.unitPrice) || 0,
        totalValue: (Number(values.unitPrice) || 0) * currentStock,
        nextRenewalDate: values.nextRenewalDate ? values.nextRenewalDate.format("YYYY-MM-DD") : null,
        type: status,
        notes: values.notes,
      };

      if (editingItem) {
        await API.put(`/collections/${editingItem._id}`, payload);
        message.success("Updated successfully");
      } else {
        await API.post("/collections", payload);
        message.success("Added successfully");
      }

      setDrawerOpen(false);
      form.resetFields();
      loadCollections();
    } catch (err) {
      console.error(err);
      message.error("Operation failed");
    }
  };

  const deleteCollection = async (id) => {
    try {
      await API.delete(`/collections/${id}`);
      message.success("Deleted");
      loadCollections();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  // 📊 Calculate stock usage percentage
  const getStockPercentage = (current, initial) => {
    if (initial === 0) return 0;
    return Math.round((current / initial) * 100);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      fixed: "left",
      width: 150,
    },
    {
      title: "Collection",
      dataIndex: "collectionName",
      width: 120,
    },
    {
      title: "Initial Stock",
      dataIndex: "initialStock",
      width: 100,
      align: "center",
      render: (val) => <strong>{val}</strong>,
    },
    {
      title: "Current Stock",
      dataIndex: "currentStock",
      width: 180,
      align: "center",
      render: (val, record) => (
        <Space>
          <Button 
            size="small" 
            danger 
            icon={<MinusOutlined />}
            onClick={() => updateStock(record._id, record.currentStock, -1)}
            disabled={record.currentStock === 0}
          />
          <span style={{ fontWeight: "bold", minWidth: 40, textAlign: "center" }}>
            {val}
          </span>
          <Button 
            size="small" 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => updateStock(record._id, record.currentStock, 1)}
          />
        </Space>
      ),
    },
    {
      title: "Usage %",
      dataIndex: "currentStock",
      render: (_, record) => {
        const percent = getStockPercentage(record.currentStock, record.initialStock);
        return (
          <Tag color={percent < 30 ? "red" : percent < 70 ? "orange" : "green"}>
            {percent}% left
          </Tag>
        );
      },
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      align: "right",
      render: (val) => val ? `$${val}` : "-",
    },
    {
      title: "Total Value",
      dataIndex: "totalValue",
      align: "right",
      render: (val) => val ? `$${val.toFixed(2)}` : "-",
    },
    {
      title: "Status",
      dataIndex: "type",
      render: (type) => <Tag color={getTagColor(type)}>{type}</Tag>,
    },
    {
      title: "Next Renewal",
      dataIndex: "nextRenewalDate",
      render: (date) => date ? dayjs(date).format("MMM DD, YYYY") : "-",
    },
    {
      title: "Action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditDrawer(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete product?"
            onConfirm={() => deleteCollection(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 📈 Summary Statistics
  const getSummaryStats = () => {
    const totalProducts = collections.length;
    const totalStockValue = collections.reduce((sum, item) => sum + (item.totalValue || 0), 0);
    const totalCurrentStock = collections.reduce((sum, item) => sum + (item.currentStock || 0), 0);
    const lowStockItems = collections.filter(item => 
      item.type === "Low Stock" || item.type === "Critical Stock"
    ).length;
    
    return { totalProducts, totalStockValue, totalCurrentStock, lowStockItems };
  };

  const stats = getSummaryStats();

  return (
    <div style={{ padding: 20 }}>
      {/* 📊 STATISTICS CARDS */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Total Products" 
              value={stats.totalProducts} 
              suffix="items"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Total Stock Value" 
              value={stats.totalStockValue} 
              prefix="$"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Total Units" 
              value={stats.totalCurrentStock} 
              suffix="pcs"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Low/Critical Stock" 
              value={stats.lowStockItems} 
              suffix="items"
              valueStyle={{ color: stats.lowStockItems > 0 ? "#cf1322" : "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="📦 Pre-Stock Management System"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddDrawer}>
            Add Product
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={collections}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* ADD/EDIT DRAWER */}
      <Drawer
        title={editingItem ? "✏️ Edit Product Stock" : "➕ Add New Product"}
        width={500}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Enter product name" }]}
          >
            <Input placeholder="e.g., Organic Green Tea" />
          </Form.Item>

          <Form.Item
            label="Collection/Category"
            name="collectionName"
            rules={[{ required: true, message: "Enter collection name" }]}
          >
            <Input placeholder="e.g., Beverages, Snacks" />
          </Form.Item>

          <Form.Item
            label="Initial Stock Count"
            name="initialStock"
            rules={[{ required: true, message: "Enter initial stock" }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: "100%" }} 
              placeholder="Starting inventory quantity"
            />
          </Form.Item>

          <Form.Item
            label="Current Stock Count"
            name="currentStock"
            tooltip="Leave empty to set same as initial stock"
          >
            <InputNumber 
              min={0} 
              style={{ width: "100%" }} 
              placeholder="Current available stock"
            />
          </Form.Item>

          <Form.Item
            label="Unit Price ($)"
            name="unitPrice"
          >
            <InputNumber 
              min={0} 
              precision={2} 
              style={{ width: "100%" }} 
              placeholder="Price per unit"
            />
          </Form.Item>

          <Form.Item
            label="Next Renewal Date"
            name="nextRenewalDate"
            tooltip="When is the next restock or subscription renewal?"
          >
            <DatePicker style={{ width: "100%" }} placeholder="Select renewal date" />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Supplier info, batch number, special instructions..."
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            {editingItem ? "Update Product" : "Add Product"}
          </Button>
        </Form>
      </Drawer>
    </div>
  );
}
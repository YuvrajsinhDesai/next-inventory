import { Card, Row, Col, Statistic, Table } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const columns = [
  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

const data = [
  { key: '1', product: 'Laptop', category: 'Electronics', stock: 45, status: 'In Stock' },
  { key: '2', product: 'Chair', category: 'Furniture', stock: 0, status: 'Out of Stock' },
  { key: '3', product: 'Monitor', category: 'Electronics', stock: 23, status: 'In Stock' },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant='outlined'>
            <Statistic
              title="Total Products"
              value={1128}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant='outlined'>
            <Statistic
              title="Low Stock"
              value={45}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant='outlined'>
            <Statistic
              title="Total Categories"
              value={15}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant='outlined'>
            <Statistic
              title="Out of Stock"
              value={23}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="Recent Inventory" 
        variant='outlined'
        className="shadow-lg"
      >
        <Table 
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
}
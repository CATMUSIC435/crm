import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Landmark } from 'lucide-react';

export default {
  title: 'Design System/Atoms/Card',
  component: Card,
  tags: ['autodocs'],
};

export const StandardCard = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">The Grand Manhattan</CardTitle>
          <Badge variant="outline" className="text-xs">Quận 1</Badge>
        </div>
        <CardDescription>Căn hộ hạng sang 3PN lõi trung tâm Sài Gòn</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-black text-indigo-600">18.5 Tỷ VNĐ</p>
        <p className="text-xs text-slate-500 mt-1">Diện tích 115m² • Tầng 18 • View Bitexco</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">Xem Sa Bàn 3D</Button>
        <Button size="sm">Khóa Căn Ngay</Button>
      </CardFooter>
    </Card>
  ),
};

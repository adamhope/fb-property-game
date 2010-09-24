class AddBestStreakUserColumn < ActiveRecord::Migration
  def self.up
    add_column :users, :best_streak, :integer, :default => 0
  end

  def self.down
    drop_column :users, :best_streak
  end
end
